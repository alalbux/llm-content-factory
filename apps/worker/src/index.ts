import { createWorker, queue, queueEvents } from "./queue.js";
import { getCampaign, updateCampaign, createContentTask, createContentVersion, listContentTasksByCampaign } from "./strapi.js";
import { runPlanner } from "./orchestrator/planner.js";
import { runGenerator } from "./orchestrator/generator.js";
import { runCritic } from "./orchestrator/critic.js";

console.log("[worker] starting...");

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.error("[queue] job failed", { jobId, failedReason });
});

queueEvents.on("completed", ({ jobId }) => {
  console.log("[queue] job completed", { jobId });
});

const worker = createWorker(async (job) => {
  const { name, data } = job;

  if (name === "plan_campaign") {
    const campaignId = Number((data as any).campaignId);
    const campaign = await getCampaign(campaignId);

    await updateCampaign(campaignId, { status: "planning" });

    const plan = await runPlanner({
      campaign: {
        name: campaign.name,
        objective: campaign.objective,
        persona: campaign.persona ?? null,
        channels: campaign.channels ?? []
      }
    });

    // cria tasks no Strapi
    for (const t of plan.tasks) {
      await createContentTask({
        campaign: campaignId,
        channel: t.channel,
        format: t.format,
        brief: t.brief,
        status: "pending"
      });
    }

    await updateCampaign(campaignId, { status: "generating" });

    // enfileira geração para cada task
    const tasks = await listContentTasksByCampaign(campaignId);
    for (const task of tasks) {
      await queue.add("generate_task", { taskId: task.id });
    }

    return { createdTasks: plan.tasks.length };
  }

  if (name === "generate_task") {
    // Aqui, idealmente buscaríamos a task no Strapi (endpoint específico).
    // Como scaffold, vamos assumir que o Strapi tem filtro por ID via /api/content-tasks/:id
    const taskId = Number((data as any).taskId);

    const taskRes = await fetch(`${process.env.STRAPI_URL}/api/content-tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` }
    });
    if (!taskRes.ok) throw new Error(`Failed to load task ${taskId}`);
    const taskJson = await taskRes.json();
    const task = (taskJson.data.attributes ?? taskJson.data) as any;

    // Busca campaign vinculada
    const campaignId = task.campaign?.data?.id ?? task.campaign?.id ?? task.campaign;
    const campaign = await getCampaign(Number(campaignId));

    const draft = await runGenerator({
      task: { channel: task.channel, format: task.format, brief: task.brief },
      campaign: { name: campaign.name, objective: campaign.objective, persona: campaign.persona ?? null }
    });

    const review = await runCritic({ title: draft.title, body: draft.body });

    const status = review.decision === "approve" ? "ready" : "needs_review";

    const version = await createContentVersion({
      task: taskId,
      version: 1,
      title: draft.title,
      body: draft.body,
      metadata: draft.metadata,
      status,
      review: review // se tiver campo json
    });

    return { contentVersionId: version?.data?.id ?? null, decision: review.decision };
  }

  throw new Error(`Unknown job: ${name}`);
});

process.on("SIGINT", async () => {
  console.log("[worker] shutting down...");
  await worker.close();
  process.exit(0);
});

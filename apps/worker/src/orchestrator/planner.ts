import { chat } from "../openai.js";

export async function runPlanner(input: {
  campaign: { name: string; objective: string; persona?: string | null; channels: string[] };
}) {
  const { campaign } = input;

  const prompt = `
Você é um Planner de conteúdo. Gere uma lista de tasks para os canais solicitados.
Retorne APENAS JSON válido no formato:
{
  "tasks": [
    { "channel": "blog|email|social|ads", "format": "article|thread|newsletter|adcopy", "brief": "..." }
  ]
}

Campanha:
- name: ${campaign.name}
- objective: ${campaign.objective}
- persona: ${campaign.persona ?? "n/a"}
- channels: ${campaign.channels.join(", ")}
`.trim();

  const out = await chat(
    [
      { role: "system", content: "Responda somente com JSON válido. Sem markdown." },
      { role: "user", content: prompt }
    ],
    { temperature: 0.3 }
  );

  return JSON.parse(out) as { tasks: Array<{ channel: string; format: string; brief: string }> };
}

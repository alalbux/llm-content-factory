export type JobName =
  | "plan_campaign"
  | "generate_task"
  | "review_version"
  | "index_knowledge_docs";

export type PlanCampaignJob = {
  name: "plan_campaign";
  data: { campaignId: number };
};

export type GenerateTaskJob = {
  name: "generate_task";
  data: { taskId: number };
};

export type ReviewVersionJob = {
  name: "review_version";
  data: { contentVersionId: number };
};

export type JobPayload =
  | PlanCampaignJob
  | GenerateTaskJob
  | ReviewVersionJob;

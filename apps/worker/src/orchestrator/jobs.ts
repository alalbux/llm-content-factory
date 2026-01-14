export type JobName = "plan_campaign" | "generate_task" | "review_version";

export type PlanCampaignPayload = { campaignId: number };
export type GenerateTaskPayload = { taskId: number };
export type ReviewVersionPayload = { contentVersionId: number };

export type JobPayload =
  | { name: "plan_campaign"; data: PlanCampaignPayload }
  | { name: "generate_task"; data: GenerateTaskPayload }
  | { name: "review_version"; data: ReviewVersionPayload };

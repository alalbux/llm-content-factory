import { z } from "zod";

export const PlanCampaignJobSchema = z.object({
  name: z.literal("plan_campaign"),
  data: z.object({
    campaignId: z.number()
  })
});

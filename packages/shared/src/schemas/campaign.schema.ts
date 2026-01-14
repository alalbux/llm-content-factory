import { z } from "zod";

export const CampaignSchema = z.object({
  id: z.number(),
  name: z.string().min(3),
  objective: z.string().min(5),
  persona: z.string().nullable().optional(),
  channels: z.array(z.string()).min(1),
  status: z.string()
});

export type CampaignDTO = z.infer<typeof CampaignSchema>;

export type CampaignStatus =
  | "draft"
  | "planning"
  | "generating"
  | "needs_review"
  | "ready"
  | "published"
  | "archived";

export type Campaign = {
  id: number;
  name: string;
  objective: string;
  persona?: string | null;
  channels: string[];
  status: CampaignStatus;
  createdAt?: string;
  updatedAt?: string;
};

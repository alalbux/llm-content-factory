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
  documentId?: string; // Strapi v5 às vezes usa documentId
  name: string;
  objective: string;
  persona?: string | null;
  channels: string[]; // ["blog","email","social","ads"]
  status: CampaignStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCampaignInput = {
  name: string;
  objective: string;
  persona?: string;
  channels: string[];
};

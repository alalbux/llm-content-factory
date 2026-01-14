export type ContentTaskStatus =
  | "pending"
  | "generating"
  | "needs_review"
  | "ready";

export type ContentTask = {
  id: number;
  campaignId: number;
  channel: string;
  format: string;
  brief: string;
  status: ContentTaskStatus;
};

export type ContentVersion = {
  id: number;
  taskId: number;
  version: number;
  title: string;
  body: string;
  metadata?: Record<string, any>;
  status: ContentTaskStatus;
};

export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "LLM Content Factory",
  strapiUrl: process.env.STRAPI_URL ?? "",
  strapiToken: process.env.STRAPI_TOKEN ?? "",
  strapiWebhookSecret: process.env.STRAPI_WEBHOOK_SECRET ?? "",
  internalWorkerUrl: process.env.INTERNAL_WORKER_URL ?? "",
  internalWorkerToken: process.env.INTERNAL_WORKER_TOKEN ?? "",
};

export function assertServerEnv() {
  const missing: string[] = [];
  if (!env.strapiUrl) missing.push("STRAPI_URL");
  if (!env.strapiToken) missing.push("STRAPI_TOKEN");
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
}

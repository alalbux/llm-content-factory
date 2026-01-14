import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.string().optional().default("development"),
  REDIS_URL: z.string().min(1),
  STRAPI_URL: z.string().min(1),
  STRAPI_TOKEN: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().min(1).default("gpt-4.1-mini"),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5),
  LOG_LEVEL: z.string().optional().default("info")
});

export const env = schema.parse(process.env);

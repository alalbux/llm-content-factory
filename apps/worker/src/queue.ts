import { Queue, Worker, QueueEvents } from "bullmq";
import { env } from "./env.js";

export const connection = {
  url: env.REDIS_URL
};

export const QUEUE_NAME = "content-factory";

export const queue = new Queue(QUEUE_NAME, { connection });
export const queueEvents = new QueueEvents(QUEUE_NAME, { connection });

export function createWorker(processor: Parameters<typeof Worker>[1]) {
  return new Worker(QUEUE_NAME, processor, {
    connection,
    concurrency: env.WORKER_CONCURRENCY
  });
}

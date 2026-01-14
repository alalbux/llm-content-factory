import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  const secret = env.strapiWebhookSecret;
  if (secret) {
    const incoming = req.headers.get("x-webhook-secret");
    if (incoming !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const payload = await req.json().catch(() => null);

  // Aqui você trataria eventos do Strapi:
  // - published
  // - updated
  // - etc.
  // Por enquanto, só logamos.
  console.log("[Strapi Webhook]", payload);

  return NextResponse.json({ ok: true });
}

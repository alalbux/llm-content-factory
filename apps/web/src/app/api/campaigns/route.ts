import { NextResponse } from "next/server";
import { createCampaign, listCampaigns } from "@/lib/strapi";
import type { CreateCampaignInput } from "@/lib/types";

export async function GET() {
  const campaigns = await listCampaigns();
  return NextResponse.json({ campaigns });
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<CreateCampaignInput>;

  if (!body?.name || !body?.objective || !Array.isArray(body.channels) || body.channels.length === 0) {
    return NextResponse.json(
      { error: "Invalid payload. Required: name, objective, channels[]" },
      { status: 400 }
    );
  }

  const campaign = await createCampaign({
    name: body.name,
    objective: body.objective,
    persona: body.persona,
    channels: body.channels,
  });

  // Aqui você pode enfileirar job no futuro (BullMQ via worker)
  // ex: POST INTERNAL_WORKER_URL/jobs/plan_campaign com campaignId

  return NextResponse.json({ campaign }, { status: 201 });
}

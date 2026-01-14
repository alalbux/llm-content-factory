import { env, assertServerEnv } from "./env";
import type { Campaign, CreateCampaignInput } from "./types";

type StrapiListResponse<T> = {
  data: Array<{
    id: number;
    documentId?: string;
    attributes?: any; // v4
    [k: string]: any; // v5
  }>;
  meta?: any;
};

type StrapiSingleResponse<T> = {
  data: {
    id: number;
    documentId?: string;
    attributes?: any;
    [k: string]: any;
  };
  meta?: any;
};

function normalizeCampaign(item: any): Campaign {
  // Strapi v4: { id, attributes: { ... } }
  // Strapi v5: { id, documentId, ...fields }
  const attrs = item.attributes ?? item;
  return {
    id: item.id,
    documentId: item.documentId,
    name: attrs.name,
    objective: attrs.objective,
    persona: attrs.persona ?? null,
    channels: attrs.channels ?? [],
    status: attrs.status ?? "draft",
    createdAt: attrs.createdAt,
    updatedAt: attrs.updatedAt,
  };
}

async function strapiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  assertServerEnv();

  const url = `${env.strapiUrl.replace(/\/$/, "")}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.strapiToken}`,
      ...(init?.headers ?? {}),
    },
    // garante que chamadas server-side não fiquem cacheadas sem querer
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Strapi error ${res.status} on ${path}: ${text}`);
  }
  return (await res.json()) as T;
}

export async function listCampaigns(): Promise<Campaign[]> {
  // Ajuste o endpoint para o seu Content Type (ex: /api/campaigns)
  const json = await strapiFetch<StrapiListResponse<Campaign>>(`/api/campaigns?sort=createdAt:desc`);
  return (json.data ?? []).map(normalizeCampaign);
}

export async function createCampaign(input: CreateCampaignInput): Promise<Campaign> {
  const payload = {
    data: {
      name: input.name,
      objective: input.objective,
      persona: input.persona ?? null,
      channels: input.channels,
      status: "draft",
    },
  };

  const json = await strapiFetch<StrapiSingleResponse<Campaign>>(`/api/campaigns`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return normalizeCampaign(json.data);
}

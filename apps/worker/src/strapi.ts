import { env } from "./env.js";

type StrapiList<T> = { data: any[]; meta?: any };
type StrapiSingle<T> = { data: any; meta?: any };

async function strapiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${env.STRAPI_URL.replace(/\/$/, "")}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.STRAPI_TOKEN}`,
      ...(init?.headers ?? {})
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Strapi ${res.status} ${path}: ${text}`);
  }
  return (await res.json()) as T;
}

function attrs(item: any) {
  return item?.attributes ?? item;
}

export async function getCampaign(campaignId: number) {
  const json = await strapiFetch<StrapiSingle<any>>(`/api/campaigns/${campaignId}`);
  const a = attrs(json.data);
  return { id: json.data.id, ...a };
}

export async function updateCampaign(campaignId: number, data: any) {
  return strapiFetch(`/api/campaigns/${campaignId}`, {
    method: "PUT",
    body: JSON.stringify({ data })
  });
}

export async function createContentTask(data: any) {
  return strapiFetch(`/api/content-tasks`, {
    method: "POST",
    body: JSON.stringify({ data })
  });
}

export async function listContentTasksByCampaign(campaignId: number) {
  const json = await strapiFetch<StrapiList<any>>(
    `/api/content-tasks?filters[campaign][id][$eq]=${campaignId}&sort=createdAt:asc`
  );
  return (json.data ?? []).map((d) => ({ id: d.id, ...attrs(d) }));
}

export async function createContentVersion(data: any) {
  return strapiFetch(`/api/content-versions`, {
    method: "POST",
    body: JSON.stringify({ data })
  });
}

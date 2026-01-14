export type StrapiConfig = {
  baseUrl: string;
  token: string;
};

export function createStrapiClient(cfg: StrapiConfig) {
  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${cfg.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.token}`,
        ...(init?.headers ?? {})
      }
    });

    if (!res.ok) {
      throw new Error(`Strapi error ${res.status}: ${path}`);
    }

    return res.json();
  }

  return { request };
}

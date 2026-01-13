import Link from "next/link";

async function getCampaigns() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/campaigns`, {
    // no App Router, fetch em server component pode precisar de URL absoluta dependendo do deploy.
    // local funciona sem; em prod recomendo setar NEXT_PUBLIC_BASE_URL.
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to load campaigns");
  return (await res.json()) as { campaigns: any[] };
}

export default async function CampaignsPage() {
  const { campaigns } = await getCampaigns();

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <Link className="rounded border px-3 py-2 text-sm hover:bg-black/5" href="/admin/campaigns/new">
          + New campaign
        </Link>
      </div>

      <div className="rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/5">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Channels</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3">{c.status}</td>
                <td className="p-3">{(c.channels ?? []).join(", ")}</td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td className="p-3 opacity-70" colSpan={3}>
                  No campaigns yet. Create the first one 👀
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

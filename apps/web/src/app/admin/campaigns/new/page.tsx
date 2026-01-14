"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const CHANNELS = ["blog", "email", "social", "ads"] as const;

export default function NewCampaignPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [persona, setPersona] = useState("");
  const [channels, setChannels] = useState<string[]>(["blog"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => name.trim().length > 2 && objective.trim().length > 5 && channels.length > 0,
    [name, objective, channels]
  );

  function toggleChannel(ch: string) {
    setChannels((prev) => (prev.includes(ch) ? prev.filter((x) => x !== ch) : [...prev, ch]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, objective, persona: persona || undefined, channels }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to create campaign");

      router.push("/admin/campaigns");
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">New Campaign</h1>

      <form onSubmit={onSubmit} className="space-y-4 rounded border p-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Name</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Q1 Acquisition - Pix"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Objective</label>
          <textarea
            className="w-full rounded border px-3 py-2"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="O que essa campanha precisa alcançar?"
            rows={3}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Persona (optional)</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            placeholder="Ex: empreendedora MEI, 25-40, SP"
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Channels</div>
          <div className="flex flex-wrap gap-2">
            {CHANNELS.map((ch) => {
              const active = channels.includes(ch);
              return (
                <button
                  key={ch}
                  type="button"
                  onClick={() => toggleChannel(ch)}
                  className={`rounded border px-3 py-2 text-sm ${
                    active ? "bg-black text-white" : "hover:bg-black/5"
                  }`}
                >
                  {ch}
                </button>
              );
            })}
          </div>
          <div className="text-xs opacity-70">
            Dica: quanto mais canais, maior a chance do robô te pedir revisão (ele é ansioso).
          </div>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          disabled={!canSubmit || loading}
          className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-40"
          type="submit"
        >
          {loading ? "Creating..." : "Create campaign"}
        </button>
      </form>
    </div>
  );
}

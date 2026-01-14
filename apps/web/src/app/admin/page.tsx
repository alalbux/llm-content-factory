import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="text-sm opacity-80">
        Gerencie campanhas, revise drafts e acompanhe status. (O robô não publica sem permissão… a menos que você mande.)
      </p>
      <Link className="inline-block underline" href="/admin/campaigns">
        Ir para Campaigns →
      </Link>
    </div>
  );
}

import type { ReactNode } from "react";
import Link from "next/link";
import { env } from "@/lib/env";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="font-semibold">{env.appName} — Admin</div>
          <nav className="flex gap-4 text-sm">
            <Link className="hover:underline" href="/admin">Home</Link>
            <Link className="hover:underline" href="/admin/campaigns">Campaigns</Link>
            <Link className="hover:underline" href="/admin/campaigns/new">New</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

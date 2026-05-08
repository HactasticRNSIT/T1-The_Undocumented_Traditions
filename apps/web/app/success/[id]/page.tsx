"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import type { TraditionRecord } from "@heritagevault/shared";

export default function SuccessPage({ params }: { params: { id: string } }) {
  const [tradition, setTradition] = useState<TraditionRecord | null>(null);
  useEffect(() => {
    api.getTradition(params.id).then(setTradition).catch(() => setTradition(null));
  }, [params.id]);
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-4 text-center">
      <div className="mx-auto h-24 w-24 rounded-full bg-gold/20 p-2 shadow-glow">
        <div className="flex h-full items-center justify-center rounded-full bg-gold text-4xl text-black">✓</div>
      </div>
      <h1 className="mt-6 font-display text-6xl font-bold">Tradition Successfully Preserved</h1>
      <p className="mt-3 text-zinc-300">Your contribution is now archived in the HeritageVault network.</p>
      <div className="glass mx-auto mt-8 w-full rounded-2xl p-6 text-left">
        <h2 className="font-display text-3xl">{tradition?.traditionName || "Tradition Record"}</h2>
        <p className="mt-2 text-sm text-zinc-300">{tradition?.summary?.shortSummary || "AI summary loading..."}</p>
      </div>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-xl border border-gold/50 px-5 py-3 text-gold">Explore Archive</Link>
        <Link href="/upload" className="rounded-xl bg-gradient-to-r from-gold to-amber-500 px-5 py-3 text-black">Document Another</Link>
      </div>
    </main>
  );
}

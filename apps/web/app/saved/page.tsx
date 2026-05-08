"use client";

import { useEffect, useState } from "react";
import { Shell } from "../../components/shell";
import { getSavedItems, removeSaved, type SavedTradition } from "../../lib/saved";

export default function SavedPage() {
  const [items, setItems] = useState<SavedTradition[]>([]);

  useEffect(() => {
    setItems(getSavedItems());
  }, []);

  function onRemove(id: string) {
    removeSaved(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <Shell>
      <main className="px-4 py-8 md:px-8">
        <h1 className="font-display text-6xl font-bold">Saved</h1>
        <p className="mt-2 max-w-3xl text-zinc-300">
          Your preserved shortlist from the vault archives.
        </p>

        {items.length === 0 ? (
          <div className="glass mt-8 rounded-2xl p-8 text-center">
            <p className="font-display text-4xl">No saved traditions yet</p>
            <p className="mt-2 text-sm text-zinc-400">Use Save on archive cards to add items here.</p>
          </div>
        ) : (
          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-lg border border-gold/20 bg-[#11171f]">
                <img src={item.img} alt={item.title} className="h-[170px] w-full object-cover" loading="lazy" decoding="async" />
                <div className="p-3">
                  <p className="font-ui text-[10px] uppercase tracking-[0.14em] text-gold/90">{item.tag}</p>
                  <h3 className="mt-1 font-display text-4xl font-bold">{item.title}</h3>
                  <p className="mt-1 text-xs text-zinc-400">{item.desc}</p>
                  <p className="mt-2 text-[10px] text-zinc-500">
                    Saved on {new Date(item.savedAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="mt-3 rounded border border-red-400/30 bg-red-500/10 px-2 py-1 font-ui text-[10px] uppercase tracking-[0.14em] text-red-200"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </Shell>
  );
}

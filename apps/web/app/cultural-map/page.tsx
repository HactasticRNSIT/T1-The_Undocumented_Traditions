"use client";

import { useState } from "react";
import { Shell } from "../../components/shell";

type Region = {
  id: string;
  name: string;
  vitality: "Critical" | "High" | "Medium" | "Stable";
  traditions: number;
  languageFamilies: string[];
  topTraditions: string[];
};

const regions: Region[] = [
  {
    id: "karnataka",
    name: "Karnataka",
    vitality: "High",
    traditions: 142,
    languageFamilies: ["Dravidian", "Indo-Aryan"],
    topTraditions: ["Yakshagana", "Kambala", "Dollu Kunitha"]
  },
  {
    id: "kerala",
    name: "Kerala",
    vitality: "Medium",
    traditions: 89,
    languageFamilies: ["Dravidian"],
    topTraditions: ["Theyyam", "Kathakali", "Koodiyattam"]
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    vitality: "High",
    traditions: 96,
    languageFamilies: ["Indo-Aryan"],
    topTraditions: ["Kalbelia", "Pabuji Phad", "Ghoomar"]
  },
  {
    id: "nagaland",
    name: "Nagaland",
    vitality: "Critical",
    traditions: 37,
    languageFamilies: ["Sino-Tibetan"],
    topTraditions: ["Log Drum Ritual", "Ao Folk Songs", "Sumi Ceremonial Chants"]
  }
];

const vitalityTone: Record<Region["vitality"], string> = {
  Critical: "text-red-300 border-red-400/40 bg-red-500/10",
  High: "text-amber-300 border-amber-400/40 bg-amber-500/10",
  Medium: "text-yellow-300 border-yellow-400/40 bg-yellow-500/10",
  Stable: "text-emerald-300 border-emerald-400/40 bg-emerald-500/10"
};

export default function CulturalMapPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region>(regions[0]);

  return (
    <Shell>
      <main className="px-4 py-8 md:px-8">
        <h1 className="font-display text-6xl font-bold">Cultural Map</h1>
        <p className="mt-2 max-w-3xl text-zinc-300">
          Explore region-linked tradition clusters, vitality risk, and language families through a living preservation map.
        </p>

        <section className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="glass rounded-2xl p-6 lg:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-4xl">India Vitality Grid</h2>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${vitalityTone[selectedRegion.vitality]}`}>
                {selectedRegion.vitality} Risk
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selectedRegion.id === region.id
                      ? "border-gold/60 bg-gold/10 shadow-glow"
                      : "border-white/10 bg-black/30 hover:border-gold/30"
                  }`}
                >
                  <p className="font-display text-2xl">{region.name}</p>
                  <p className="mt-1 text-xs text-zinc-400">{region.traditions} traditions</p>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-gold/20 bg-[#0b1118] p-4">
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-gold">Top Traditions in {selectedRegion.name}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedRegion.topTraditions.map((item) => (
                  <span key={item} className="rounded-md border border-gold/30 bg-gold/10 px-2 py-1 text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-5 lg:col-span-4">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-3xl">{selectedRegion.name}</h3>
              <p className="mt-1 text-sm text-zinc-300">{selectedRegion.traditions} documented living traditions</p>
              <div className="mt-4">
                <p className="font-ui text-xs uppercase tracking-[0.16em] text-gold">Language Families</p>
                <div className="mt-2 space-y-2">
                  {selectedRegion.languageFamilies.map((family) => (
                    <p key={family} className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm">
                      {family}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h4 className="font-ui text-xs uppercase tracking-[0.2em] text-gold">Suggested Actions</h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                <li>Record elder oral narratives in endangered dialect clusters.</li>
                <li>Upload seasonal ritual footage before migration cycles.</li>
                <li>Connect with local archivists for metadata verification.</li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </Shell>
  );
}

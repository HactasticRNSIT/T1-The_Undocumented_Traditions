"use client";

import { useState } from "react";
import { Shell } from "../../components/shell";

type Circle = {
  id: string;
  name: string;
  members: number;
  focus: string;
  region: string;
};

const circles: Circle[] = [
  { id: "oral-keepers", name: "Oral Keepers Circle", members: 48, focus: "Elder interviews", region: "Karnataka" },
  { id: "ritual-archive", name: "Ritual Archive Guild", members: 31, focus: "Ritual footage", region: "Kerala" },
  { id: "folk-language", name: "Folk Language Lab", members: 26, focus: "Dialect preservation", region: "Rajasthan" },
  { id: "festival-documenters", name: "Festival Documenters", members: 52, focus: "Event curation", region: "Pan-India" }
];

export default function CommunityPage() {
  const [selectedCircle, setSelectedCircle] = useState<Circle>(circles[0]);

  return (
    <Shell>
      <main className="px-4 py-8 md:px-8">
        <h1 className="font-display text-6xl font-bold">Community</h1>
        <p className="mt-2 max-w-3xl text-zinc-300">
          Join preservation circles, coordinate field documentation, and collaborate with cultural stewards across regions.
        </p>

        <section className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="glass rounded-2xl p-6 lg:col-span-8">
            <h2 className="font-display text-4xl">Active Circles</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {circles.map((circle) => (
                <button
                  key={circle.id}
                  onClick={() => setSelectedCircle(circle)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selectedCircle.id === circle.id
                      ? "border-gold/60 bg-gold/10 shadow-glow"
                      : "border-white/10 bg-black/30 hover:border-gold/30"
                  }`}
                >
                  <p className="font-display text-3xl">{circle.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-zinc-400">{circle.region}</p>
                  <p className="mt-2 text-sm text-zinc-300">{circle.members} members · {circle.focus}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-gold/20 bg-[#0b1118] p-4">
              <p className="font-ui text-xs uppercase tracking-[0.16em] text-gold">Open Requests</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                <li>{selectedCircle.name}: Need 2 volunteers for weekend oral-history recording.</li>
                <li>{selectedCircle.region}: Metadata review requested for 12 newly uploaded clips.</li>
                <li>Translation support needed for regional dialect annotations.</li>
              </ul>
            </div>
          </div>

          <aside className="space-y-5 lg:col-span-4">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-3xl">{selectedCircle.name}</h3>
              <p className="mt-2 text-sm text-zinc-300">{selectedCircle.members} active contributors</p>
              <p className="mt-2 text-sm text-zinc-300">Primary Focus: {selectedCircle.focus}</p>
              <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-gold to-amber-500 py-3 font-ui text-sm font-semibold text-black shadow-glow">
                Join Circle
              </button>
            </div>

            <div className="glass rounded-2xl p-6">
              <h4 className="font-ui text-xs uppercase tracking-[0.2em] text-gold">Upcoming Events</h4>
              <div className="mt-3 space-y-3 text-sm">
                <div className="rounded-md border border-white/10 bg-black/30 p-3">
                  <p className="font-semibold">Archive Sprint</p>
                  <p className="text-zinc-400">Saturday · 10:00 AM IST</p>
                </div>
                <div className="rounded-md border border-white/10 bg-black/30 p-3">
                  <p className="font-semibold">Dialect Lab Session</p>
                  <p className="text-zinc-400">Monday · 7:30 PM IST</p>
                </div>
                <div className="rounded-md border border-white/10 bg-black/30 p-3">
                  <p className="font-semibold">Regional Curator Meet</p>
                  <p className="text-zinc-400">Wednesday · 6:00 PM IST</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </Shell>
  );
}

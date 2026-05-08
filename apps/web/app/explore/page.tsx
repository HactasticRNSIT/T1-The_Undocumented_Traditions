"use client";

import { useMemo, useState } from "react";
import { Shell } from "../../components/shell";

type ExploreItem = {
  id: string;
  title: string;
  region: string;
  category: string;
  language: string;
  risk: "Critical" | "High" | "Medium" | "Stable";
  img: string;
};

const data: ExploreItem[] = [
  {
    id: "kambala",
    title: "Kambala",
    region: "Karnataka",
    category: "Ritual",
    language: "Kannada",
    risk: "High",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBe4k7_19tEPlhDoIEWFR79ooyzNTAji0sZzzFiMpdAxJI-1Rp8djQqacU1tKBnDxYjF7DmHhS88VO4WguKu6y24a9vOU3tiB5iTzq5vcBqvJgyNX3xYRz38wSPZDpAjnq6PR3aqmPQRuaDOR4gvv1m3zPsqEJbQS0Nj20e7icqx5kcuGCGT11lmQHFgoZd2sP4G0i3L3736QSuUIBEN6MWyWxSwx6r6uxrGZn8TsBeNZAVFN0pTN_yMG3e0oXSOLSJbsGVV27SG-U"
  },
  {
    id: "theyyam",
    title: "Theyyam",
    region: "Kerala",
    category: "Sacred Performance",
    language: "Malayalam",
    risk: "Medium",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuGmEy4p1A7K_d6TYVbkzxZDWTv9jrLqJ9so416PuzoWhCJpn6g9KZ5ZZk_3b4Y9j4x5fD8APlp0Bc1kMot6JXfHvph5k34MvyX_V2bPTuH6JOFELG9gjdyxvEQvJdozE5Ox0qNqqnHFseu1e716CzYVRF-0Y8BsSAgLCfY_ILvlOvtiZYss3bzWYizAsPQZODVfR8xl-uj9jVJ6EGMP0NTmRJ-yvB1QGs4YBRk43H_UdMCjG1saLtoTUyjJTwyEAyTIf2vSYWaHg"
  },
  {
    id: "yakshagana",
    title: "Yakshagana",
    region: "Karnataka",
    category: "Theatre",
    language: "Tulu",
    risk: "High",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiiGgDtuqUaQGIPthB_N-e23R_TnbdXGQRXbDDw3oYZ9zbE86TcwRwfqWAlZc7dEKuVTEwkLXAFCNEyHb1zfyIhRSYqNLkRuChcZO6ia5EenSqOOZMqWfUp-FyfLyOs4BLqYVjmqc1Ul5fxmMU-DDY3zkeJ21ZTnoxazfa3Q_YNkMTxsFDDrbDzpnlJhLgztz594gdKiMPK7yLIKNRgmq5wtR1O6x9FsRr4Z-nwxxw1c0m4HXWaBsVNVp6kPHuIVjFVUGwJWc71cY"
  },
  {
    id: "phad",
    title: "Pabuji Phad",
    region: "Rajasthan",
    category: "Oral Epic",
    language: "Rajasthani",
    risk: "Critical",
    img: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91d?q=80&w=1200&auto=format&fit=crop"
  }
];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState<"All" | ExploreItem["risk"]>("All");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(data.map((x) => x.category)))], []);

  const filtered = useMemo(
    () =>
      data.filter((item) => {
        const bySearch = !search.trim() || `${item.title} ${item.region} ${item.language}`.toLowerCase().includes(search.toLowerCase());
        const byRisk = risk === "All" || item.risk === risk;
        const byCategory = category === "All" || item.category === category;
        return bySearch && byRisk && byCategory;
      }),
    [search, risk, category]
  );

  return (
    <Shell>
      <main className="px-4 py-8 md:px-8">
        <h1 className="font-display text-6xl font-bold">Explore</h1>
        <p className="mt-2 max-w-3xl text-zinc-300">
          Discover documented traditions by region, category, language, and vitality risk.
        </p>

        <section className="glass mt-8 rounded-2xl p-5">
          <div className="grid gap-3 md:grid-cols-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search traditions, region, language..."
              className="rounded-xl bg-black/40 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-gold/50 md:col-span-2"
            />
            <select value={risk} onChange={(e) => setRisk(e.target.value as "All" | ExploreItem["risk"])} className="rounded-xl bg-black/40 px-3 py-2 text-sm">
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Stable">Stable</option>
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl bg-black/40 px-3 py-2 text-sm">
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-lg border border-gold/20 bg-[#11171f]">
              <img src={item.img} alt={item.title} className="h-[180px] w-full object-cover" loading="lazy" decoding="async" />
              <div className="p-3">
                <h2 className="font-display text-4xl">{item.title}</h2>
                <p className="mt-1 text-xs text-zinc-400">{item.region} · {item.language}</p>
                <div className="mt-2 flex gap-2">
                  <span className="rounded border border-gold/30 bg-gold/10 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-gold">{item.category}</span>
                  <span className="rounded border border-white/20 bg-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.12em]">
                    {item.risk}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </Shell>
  );
}

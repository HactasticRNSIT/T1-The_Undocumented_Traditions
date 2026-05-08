"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { Shell } from "../components/shell";
import { Section } from "../components/section";
import { AmbientScene } from "../components/ambient-scene";
import { getSavedItems, isSaved, toggleSaved, type SavedTradition } from "../lib/saved";

const stats = [
  ["3250+", "Traditions"],
  ["120+", "Communities"],
  ["28", "Languages"],
  ["1.2K", "Contributors"]
];

const archiveCards = [
  {
    id: "kambala",
    title: "Kambala",
    tag: "Ritual",
    desc: "The thunderous bull race through the slushy fields of coastal Karnataka.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBe4k7_19tEPlhDoIEWFR79ooyzNTAji0sZzzFiMpdAxJI-1Rp8djQqacU1tKBnDxYjF7DmHhS88VO4WguKu6y24a9vOU3tiB5iTzq5vcBqvJgyNX3xYRz38wSPZDpAjnq6PR3aqmPQRuaDOR4gvv1m3zPsqEJbQS0Nj20e7icqx5kcuGCGT11lmQHFgoZd2sP4G0i3L3736QSuUIBEN6MWyWxSwx6r6uxrGZn8TsBeNZAVFN0pTN_yMG3e0oXSOLSJbsGVV27SG-U"
  },
  {
    id: "theyyam",
    title: "Theyyam",
    tag: "Sacred",
    desc: "A dance of the gods where man becomes the divine vessel through color and flame.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuGmEy4p1A7K_d6TYVbkzxZDWTv9jrLqJ9so416PuzoWhCJpn6g9KZ5ZZk_3b4Y9j4x5fD8APlp0Bc1kMot6JXfHvph5k34MvyX_V2bPTuH6JOFELG9gjdyxvEQvJdozE5Ox0qNqqnHFseu1e716CzYVRF-0Y8BsSAgLCfY_ILvlOvtiZYss3bzWYizAsPQZODVfR8xl-uj9jVJ6EGMP0NTmRJ-yvB1QGs4YBRk43H_UdMCjG1saLtoTUyjJTwyEAyTIf2vSYWaHg"
  },
  {
    id: "yakshagana",
    title: "Yakshagana",
    tag: "Theater",
    desc: "Celestial drama blending dance, music, and improvised dialogue from the epics.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiiGgDtuqUaQGIPthB_N-e23R_TnbdXGQRXbDDw3oYZ9zbE86TcwRwfqWAlZc7dEKuVTEwkLXAFCNEyHb1zfyIhRSYqNLkRuChcZO6ia5EenSqOOZMqWfUp-FyfLyOs4BLqYVjmqc1Ul5fxmMU-DDY3zkeJ21ZTnoxazfa3Q_YNkMTxsFDDrbDzpnlJhLgztz594gdKiMPK7yLIKNRgmq5wtR1O6x9FsRr4Z-nwxxw1c0m4HXWaBsVNVp6kPHuIVjFVUGwJWc71cY"
  }
];

export default function HomePage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedItems, setSavedItems] = useState<SavedTradition[]>([]);

  useEffect(() => {
    gsap.fromTo(".hero-copy", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 });
    setSavedIds(archiveCards.filter((card) => isSaved(card.id)).map((card) => card.id));
    setSavedItems(getSavedItems());
  }, []);

  function onToggleSave(card: (typeof archiveCards)[number]) {
    const nowSaved = toggleSaved({
      id: card.id,
      title: card.title,
      tag: card.tag,
      desc: card.desc,
      img: card.img
    });
    setSavedIds((prev) => (nowSaved ? [...prev, card.id] : prev.filter((id) => id !== card.id)));
    setSavedItems(getSavedItems());
  }

  return (
    <Shell>
      <AmbientScene />
      <main className="mx-auto max-w-[980px] px-4 pb-20 pt-2 md:px-6">
        <section className="relative overflow-hidden rounded-xl border border-gold/20 bg-[#0b0e12]">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4BXtXkJ6xm3ixF3SAKuvqVGtExQ-MCR05WjXfMXbVOSzrIJ-zesGOdxD8HS0O9NE1MgQ44ttqc1yagKOLaXPSA0iOdwuctSq1JqivFDHG7b7D0gYWgILqbyuv7ybudyA5GQ7_NCjsxpq8RrnuQJLCq-znq1MOLbqDhq181W-wKAHc4YfjdWq-OpntpQ-hTlg_FBRLohkkZeguSR7Ehb4TGWx6SgpqnfG-Ucp-cuxYWminNqhMTu9RXEM0peTPIKGdi3i8Ifg5vBI"
            alt="Hero Fire"
            className="h-[560px] w-full object-cover opacity-65 md:h-[620px]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
          <div className="hero-copy absolute inset-y-0 left-6 z-10 flex max-w-[560px] flex-col justify-center py-10">
            <p className="mb-3 inline-block rounded border border-gold/70 bg-gold/10 px-2.5 py-1 font-ui text-[10px] uppercase tracking-[0.12em] text-gold">
              AI-Powered Preservation
            </p>
            <h1 className="font-display text-5xl font-bold leading-[1.04] md:text-[82px]">
              Preserving Traditions
              <br />
              Before They <span className="text-gold">Disappear</span>
            </h1>
            <p className="mt-3 max-w-[470px] text-sm leading-relaxed text-zinc-300">
              Every hour, a dialect dies. Every day, a ritual is forgotten. HeritageVault uses cinematic archival tech and neural mapping to secure humanity&apos;s intangible soul.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button className="rounded-sm bg-gradient-to-r from-gold to-amber-500 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.14em] text-black">
                Document a Tradition
              </button>
              <button className="rounded-sm border border-gold/70 bg-black/30 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.14em] text-gold">
                Watch Stories
              </button>
            </div>
          </div>
        </section>

        <Section className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="rounded-md border border-gold/30 bg-[#11161d] p-3 text-center">
              <p className="font-display text-[38px] font-bold leading-none text-gold">{value}</p>
              <p className="mt-1 font-ui text-[10px] uppercase tracking-[0.16em] text-zinc-400">{label}</p>
            </div>
          ))}
        </Section>

        <Section className="mt-16 grid gap-7 md:grid-cols-2">
          <div>
            <h2 className="font-display text-6xl font-bold leading-[0.98]">
              Global
              <br />
              Vitality
              <br />
              <span className="text-gold">Index</span>
            </h2>
            <p className="mt-4 max-w-[280px] text-xs text-zinc-300">
              Navigate the digital topography of heritage. Select regions to explore preservation nodes.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between rounded border border-gold/30 bg-black/40 px-3 py-2 text-xs">
                <span>Karnataka, India</span>
                <span className="text-gold">142 Traditions</span>
              </div>
              <div className="flex justify-between rounded border border-white/10 bg-black/30 px-3 py-2 text-xs">
                <span>Kerala, India</span>
                <span>89 Traditions</span>
              </div>
              <div className="flex justify-between rounded border border-white/10 bg-black/30 px-3 py-2 text-xs">
                <span>Rajasthan, India</span>
                <span>96 Traditions</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gold/20 bg-[#0f141b] p-3">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy07ii34hvgcZnhGqxlv1cuzqkbl6Vxqu5-j1A2fVlj6sKm2n5tRpLo2s9yT6sGCNkm70JjanIv_MxSH4MqUTc4LGCpHMK6aJFa6p-62fqs5Evi9gLobuyK_5NRoEP374adiraxYaURX3J_impY2svJxv2LM0h-f-jML4HhpCLbIieCZYbLSqAgiLlge5DoR61jpR-HD3A1oDqM7jLw4ACYWCNGMEcnAI5go_5QVcxi_sbu6jsBCUL0wuH1uAckdXFkdJzBBxRKi4"
              alt="India map"
              className="h-[250px] w-full rounded-lg object-cover opacity-60"
              loading="lazy"
              decoding="async"
            />
          </div>
        </Section>

        <Section className="mt-16">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="font-display text-5xl font-bold">The Vault <span className="text-gold">Archives</span></h2>
              <p className="text-xs text-zinc-400">Cinematic documentation of our living ancestors.</p>
            </div>
            <span className="font-ui text-[10px] uppercase tracking-[0.16em] text-gold">View All Chapters</span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {archiveCards.map((card) => (
              <article key={card.id} className="group overflow-hidden rounded-lg border border-gold/20 bg-[#11171f]">
                <img
                  src={card.img}
                  alt={card.title}
                  className="h-[180px] w-full object-cover transition group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="p-3">
                  <p className="font-ui text-[10px] uppercase tracking-[0.14em] text-gold/90">{card.tag}</p>
                  <h3 className="mt-1 font-display text-4xl font-bold">{card.title}</h3>
                  <p className="mt-1 text-xs text-zinc-400">{card.desc}</p>
                  <div className="mt-3 flex gap-3">
                    <button className="font-ui text-[10px] uppercase tracking-[0.14em] text-gold">Watch Archive</button>
                    <button
                      onClick={() => onToggleSave(card)}
                      className={`font-ui text-[10px] uppercase tracking-[0.14em] ${
                        savedIds.includes(card.id) ? "text-emerald-300" : "text-zinc-300"
                      }`}
                    >
                      {savedIds.includes(card.id) ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section className="mt-14">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-5xl font-bold">Saved <span className="text-gold">Preservations</span></h2>
            <a href="/saved" className="font-ui text-[10px] uppercase tracking-[0.16em] text-gold">Open Saved</a>
          </div>
          {savedItems.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-5 text-sm text-zinc-400">
              No preserved items yet. Save from archives or submit a new tradition from Upload.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              {savedItems.slice(0, 3).map((item) => (
                <article key={item.id} className="overflow-hidden rounded-lg border border-gold/20 bg-[#10161d]">
                  <img src={item.img} alt={item.title} className="h-[160px] w-full object-cover" loading="lazy" decoding="async" />
                  <div className="p-3">
                    <p className="font-ui text-[10px] uppercase tracking-[0.14em] text-gold">{item.tag}</p>
                    <h3 className="mt-1 font-display text-3xl">{item.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{item.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Section>

        <Section className="mt-16 rounded-xl border border-gold/20 bg-[#0f151d] p-8">
          <h2 className="text-center font-display text-5xl font-bold">Threat <span className="text-gold">Assessment</span></h2>
          <div className="mt-7 grid gap-3 md:grid-cols-4">
            {[
              ["Critical", "88%"],
              ["High", "65%"],
              ["Medium", "42%"],
              ["Dormant", "18%"]
            ].map(([label, pct]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-black/20 p-3 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold/80 font-ui text-xs text-gold">
                  {pct}
                </div>
                <p className="mt-2 font-ui text-[10px] uppercase tracking-[0.14em]">{label}</p>
                <p className="mt-1 text-[10px] text-zinc-400">Risk telemetry in active monitoring mode.</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="mt-16 grid gap-7 md:grid-cols-2">
          <div className="rounded-xl border border-gold/20 bg-[#121920] p-4">
            <p className="font-ui text-[10px] uppercase tracking-[0.16em] text-gold">Ethnolinguistic AI</p>
            <div className="mt-4 flex h-[90px] items-end justify-center gap-1">
              {Array.from({ length: 15 }).map((_, i) => (
                <span key={i} className="w-1 rounded-full bg-gold/85" style={{ height: `${14 + ((i * 17) % 64)}px` }} />
              ))}
            </div>
            <p className="mt-3 rounded bg-black/35 p-2 font-mono text-[10px] text-zinc-300">
              [AI Transcription]: &quot;The spirits of the ancestors live in the wind...&quot;
            </p>
          </div>
          <div>
            <h2 className="font-display text-6xl font-bold leading-[0.98]">
              Preservation at
              <br />
              the <span className="text-gold">Speed of Light</span>
            </h2>
            <p className="mt-3 text-sm text-zinc-300">
              Our proprietary AI does not just record; it understands. From real-time dialect translation to 3D ritual reconstruction, we turn fragile moments into immutable digital assets.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              <li>Semantic Pattern Recognition</li>
              <li>Neural Voice Synthesis for Dying Dialects</li>
              <li>Volumetric Video Capture Integration</li>
            </ul>
            <button className="mt-5 rounded border border-gold/70 px-4 py-2 font-ui text-xs uppercase tracking-[0.14em] text-gold">
              Explore the Tech Stack
            </button>
          </div>
        </Section>

        <footer className="mt-16 rounded-xl border border-white/10 bg-[#090d12] px-5 py-10">
          <h3 className="text-center font-display text-4xl font-bold">HeritageVault</h3>
          <p className="mt-2 text-center text-sm text-gold">&quot;A tradition recorded today is a legacy protected forever.&quot;</p>
          <div className="mt-8 grid gap-6 text-xs text-zinc-300 md:grid-cols-4">
            <div>Archive<br />Oral Histories<br />Ritual Maps<br />Artifact 3D Models</div>
            <div>Community<br />Curator Program<br />Regional Nodes<br />Partner Institutes</div>
            <div>Project<br />Our Mission<br />Open Data Policy<br />Ethics Framework</div>
            <div>
              Newsletter
              <div className="mt-2 flex gap-2">
                <input className="w-full rounded bg-white/10 px-3 py-2 text-xs" placeholder="Email" />
                <button className="rounded bg-gold px-3 text-xs text-black">Join</button>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </Shell>
  );
}

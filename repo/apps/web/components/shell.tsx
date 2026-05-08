"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { clearSession, getSession } from "../lib/auth";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "#" },
  { label: "Cultural Map", href: "#" },
  { label: "Upload Tradition", href: "/upload" },
  { label: "Community", href: "#" },
  { label: "AI Insights", href: "#" },
  { label: "Saved", href: "#" }
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [initials, setInitials] = useState("HV");

  useEffect(() => {
    const session = getSession();
    if (session?.user?.initials) setInitials(session.user.initials);
  }, []);

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="min-h-screen bg-[#05090e]">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[250px] flex-col border-r border-gold/20 bg-[#050b11]/95 px-4 py-3 backdrop-blur-xl md:flex">
        <h1 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-display text-[28px] font-bold leading-none text-gold">
          HeritageVault
        </h1>
        <p className="mt-1 font-ui text-[9px] uppercase tracking-[0.18em] text-zinc-500">Preserving Traditions</p>

        <nav className="mt-7 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`block rounded-md px-3 py-2.5 font-ui text-[11px] uppercase tracking-[0.12em] transition ${
                pathname === item.href ? "bg-gold/10 text-gold shadow-glow" : "text-zinc-300 hover:bg-white/5 hover:text-gold"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="mt-auto mb-4 rounded-full bg-gradient-to-r from-gold to-amber-500 py-3 font-ui text-[11px] uppercase tracking-[0.14em] text-black shadow-glow">
          Preserve Now
        </button>
      </aside>

      <div className="md:ml-[250px]">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-[#0a1016]/90 px-4 py-3 backdrop-blur md:px-8">
          <button className="rounded border border-white/20 px-2 py-1 text-xs md:hidden" onClick={() => setOpen((s) => !s)}>
            Menu
          </button>
          <input
            placeholder="Search ancient archives..."
            className="w-full max-w-xl rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs outline-none focus:border-gold/70"
          />
          <button className="rounded-full border border-white/20 px-3 py-2 text-xs">🌐</button>
          <button className="rounded-full border border-white/20 px-3 py-2 text-xs">🔔</button>
          <div className="relative" ref={profileRef}>
            <button
              className="h-9 w-9 rounded-full border border-gold/40 bg-gold/15 font-bold"
              onClick={() => setProfileOpen((s) => !s)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              {initials}
            </button>
            <div
              className={`absolute right-0 top-11 w-44 rounded-xl border border-gold/20 bg-black/90 p-2 transition ${
                profileOpen ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              <Link href="/auth" className="block rounded px-3 py-2 text-sm hover:bg-white/10">
                Login
              </Link>
              <Link href="/auth" className="block rounded px-3 py-2 text-sm hover:bg-white/10">
                Sign Up
              </Link>
              <Link href="#" className="block rounded px-3 py-2 text-sm hover:bg-white/10">
                My Archive
              </Link>
              <button
                className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-white/10"
                onClick={() => {
                  setProfileOpen(false);
                  clearSession();
                  router.push("/auth");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {open && (
          <div className="border-b border-white/10 bg-black/80 p-3 md:hidden">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="block py-2 text-sm text-zinc-200">
                {item.label}
              </Link>
            ))}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
}

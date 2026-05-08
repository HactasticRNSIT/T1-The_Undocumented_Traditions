"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";
import { setSession } from "../../lib/auth";
import type { AuthResponse } from "@heritagevault/shared";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (loading) return;
    setLoading(true);
    const payload = {
      name: form.name || form.email?.split("@")[0] || "Vault User",
      email: form.email || "demo@heritagevault.ai"
    };
    let session: AuthResponse;
    try {
      session = mode === "login" ? await api.login(payload) : await api.signup(payload);
    } catch {
      session = {
        token: `mock.jwt.${btoa(payload.email)}`,
        user: {
          id: crypto.randomUUID(),
          name: payload.name,
          email: payload.email,
          initials: (payload.name || "HV")
            .split(" ")
            .map((x) => x[0]?.toUpperCase())
            .filter(Boolean)
            .slice(0, 2)
            .join("")
        }
      };
    }
    setSession(session);
    setLoading(false);
    router.push("/upload");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1550537687-c91072c4792d?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      <div className="glass relative z-10 w-full max-w-xl rounded-3xl p-8 md:p-10">
        <h1 className="text-center font-display text-6xl font-bold text-gold">{mode === "login" ? "Welcome Back" : "Create Vault Access"}</h1>
        <p className="mt-2 text-center text-zinc-300">Step into the digital sanctuary of our collective past.</p>
        <div className="mt-8 space-y-4">
          {mode === "signup" && (
            <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" placeholder="Full Name" onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          )}
          <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" placeholder="Email" onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
          <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" placeholder="Password" type="password" onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
          {mode === "signup" && (
            <>
              <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" placeholder="Confirm Password" type="password" />
              <input className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3" placeholder="Region / Community" />
              <select className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                <option>Preferred Language</option>
                <option>English</option><option>Kannada</option><option>Hindi</option><option>Tamil</option><option>Telugu</option><option>Malayalam</option>
              </select>
            </>
          )}
          <div className="flex items-center justify-between text-sm text-zinc-300">
            <label><input type="checkbox" className="mr-2" />Remember me</label>
            <span>Forgot password</span>
          </div>
          <button
            onClick={submit}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-gold to-amber-500 px-4 py-3 font-ui font-semibold text-black shadow-glow disabled:opacity-70"
          >
            {loading ? "Entering..." : mode === "login" ? "Login" : "Create Account"}
          </button>
          <button onClick={submit} disabled={loading} className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 font-ui disabled:opacity-70">
            Continue with Google
          </button>
          <p className="text-center text-zinc-300">
            {mode === "login" ? "Don't have account?" : "Already have account?"}{" "}
            <button className="text-gold" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
              {mode === "login" ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

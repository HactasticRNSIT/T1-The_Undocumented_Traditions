import type {
  AuthResponse,
  MediaAnalysisResult,
  SummaryResult,
  TraditionCreatePayload,
  TraditionRecord,
  TranscriptionResult,
  TranslationResult
} from "@heritagevault/shared";
import { API_BASE } from "./config";

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) }
  });
  return res.json() as Promise<T>;
}

export const api = {
  login: (payload: Record<string, string>) =>
    json<AuthResponse>("/auth/mock/login", { method: "POST", body: JSON.stringify(payload) }),
  signup: (payload: Record<string, string>) =>
    json<AuthResponse>("/auth/mock/signup", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => json<{ ok: boolean }>("/auth/mock/logout", { method: "POST" }),
  transcribe: () => json<TranscriptionResult>("/ai/transcribe", { method: "POST", body: JSON.stringify({}) }),
  summarize: (text: string) =>
    json<SummaryResult>("/ai/summarize", { method: "POST", body: JSON.stringify({ text }) }),
  translate: (text: string, language: string) =>
    json<TranslationResult>("/ai/translate", { method: "POST", body: JSON.stringify({ text, language }) }),
  analyzeMedia: () => json<MediaAnalysisResult>("/ai/media-analyze", { method: "POST", body: JSON.stringify({}) }),
  createTradition: (payload: TraditionCreatePayload) =>
    json<TraditionRecord>("/traditions", { method: "POST", body: JSON.stringify(payload) }),
  getTradition: (id: string) => json<TraditionRecord>(`/traditions/${id}`),
  uploadMedia: async (files: File[]) => {
    const fd = new FormData();
    files.forEach((file) => fd.append("files", file));
    const res = await fetch(`${API_BASE}/media/upload`, { method: "POST", body: fd });
    return res.json() as Promise<{ files: TraditionCreatePayload["media"] }>;
  }
};

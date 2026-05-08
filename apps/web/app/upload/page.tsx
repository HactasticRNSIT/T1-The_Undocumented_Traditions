"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { MediaAnalysisResult, SummaryResult, SupportedLanguage, TraditionCreatePayload } from "@heritagevault/shared";
import { Shell } from "../../components/shell";
import { getSession } from "../../lib/auth";
import { api } from "../../lib/api";

const langs: SupportedLanguage[] = ["English", "Kannada", "Hindi", "Tamil", "Telugu", "Malayalam"];

export default function UploadPage() {
  const router = useRouter();
  const [core, setCore] = useState({
    traditionName: "",
    historicalPeriod: "Ancient (Before 1000 CE)",
    originLocation: "",
    language: "English" as SupportedLanguage,
    description: ""
  });
  const [transcript, setTranscript] = useState("");
  const [rawTranscript, setRawTranscript] = useState("");
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [translation, setTranslation] = useState<Partial<Record<SupportedLanguage, string>>>({});
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>("Kannada");
  const [files, setFiles] = useState<File[]>([]);
  const [uploaded, setUploaded] = useState<TraditionCreatePayload["media"]>([]);
  const [analysis, setAnalysis] = useState<MediaAnalysisResult | null>(null);
  const [privacy, setPrivacy] = useState<"public" | "community" | "private">("public");
  const [loading, setLoading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!getSession()) router.push("/auth");
  }, [router]);

  useEffect(() => {
    return () => {
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [recordedUrl]);

  const canSubmit = useMemo(() => core.traditionName.trim().length > 0, [core.traditionName]);

  async function startRecording() {
    if (isRecording) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
      setRecordedBlob(blob);
      setRecordedUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach((track) => track.stop());
      setRecorder(null);
      setIsRecording(false);
    };

    mediaRecorder.start();
    setRecorder(mediaRecorder);
    setIsRecording(true);
  }

  function stopRecording() {
    if (!recorder || recorder.state === "inactive") return;
    recorder.stop();
  }

  function playbackRecording() {
    if (!recordedUrl) return;
    const audio = new Audio(recordedUrl);
    void audio.play();
  }

  async function transcribe() {
    const data = await api.transcribe();
    setRawTranscript(data.transcript);

    // Convert recorded speech text into the currently selected preferred language.
    const localized = await api.translate(data.transcript, targetLanguage);
    setTranscript(localized.translatedText);
    setTranslation((s) => ({ ...s, [targetLanguage]: localized.translatedText }));

    const aiSummary = await api.summarize(data.transcript);
    setSummary(aiSummary);
  }

  async function doTranslate() {
    const t = await api.translate(transcript || core.description, targetLanguage);
    setTranslation((s) => ({ ...s, [targetLanguage]: t.translatedText }));
  }

  async function uploadMedia() {
    const queue = [...files];
    if (recordedBlob) {
      queue.push(new File([recordedBlob], `voice-note-${Date.now()}.webm`, { type: "audio/webm" }));
    }
    if (!queue.length) return;

    const up = await api.uploadMedia(queue);
    setUploaded(up.files);
    const mediaInsights = await api.analyzeMedia();
    setAnalysis(mediaInsights);
  }

  async function submit() {
    if (!canSubmit) return;
    setLoading(true);
    const created = await api.createTradition({
      ...core,
      transcript,
      summary:
        summary ||
        ({
          shortSummary: "Awaiting AI summary.",
          culturalSignificance: "To be generated.",
          keywords: [],
          ritualCategory: "Unknown",
          historicalContext: "Unknown"
        } as SummaryResult),
      translations: translation,
      media: uploaded,
      mediaAnalysis:
        analysis ||
        ({
          detectedObjects: [],
          traditionalClothing: [],
          ritualTools: [],
          danceForms: [],
          festivalEnvironment: "",
          emotions: [],
          generatedTags: []
        } as MediaAnalysisResult),
      privacy
    });
    setLoading(false);
    router.push(`/success/${created._id}`);
  }

  return (
    <Shell>
      <main className="px-4 py-8 md:px-8">
        <h1 className="font-display text-6xl font-bold">Document a Living Tradition</h1>
        <p className="mt-2 max-w-2xl text-zinc-300">Ensuring the wisdom of the past fuels the innovation of the future.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className="space-y-5 lg:col-span-8">
            <div className="glass rounded-2xl p-6">
              <h2 className="font-display text-4xl">Core Details</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input className="rounded-xl bg-black/30 p-3 md:col-span-2" placeholder="Tradition Name" value={core.traditionName} onChange={(e) => setCore((s) => ({ ...s, traditionName: e.target.value }))} />
                <select className="rounded-xl bg-black/30 p-3" value={core.historicalPeriod} onChange={(e) => setCore((s) => ({ ...s, historicalPeriod: e.target.value }))}>
                  <option>Ancient (Before 1000 CE)</option><option>Pre-Industrial (1000-1850)</option><option>Modern Emergent</option>
                </select>
                <select className="rounded-xl bg-black/30 p-3" value={core.language} onChange={(e) => setCore((s) => ({ ...s, language: e.target.value as SupportedLanguage }))}>
                  {langs.map((l) => <option key={l}>{l}</option>)}
                </select>
                <input className="rounded-xl bg-black/30 p-3 md:col-span-2" placeholder="Origin Location" onChange={(e) => setCore((s) => ({ ...s, originLocation: e.target.value }))} />
                <textarea className="min-h-28 rounded-xl bg-black/30 p-3 md:col-span-2" placeholder="Description" onChange={(e) => setCore((s) => ({ ...s, description: e.target.value }))} />
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-3xl">Voice Recorder + Whisper</h3>
              <div className="mt-4 flex items-center gap-4">
                <button onClick={transcribe} className="h-16 w-16 rounded-full bg-gold text-2xl text-black shadow-glow">🎤</button>
                <button onClick={startRecording} disabled={isRecording} className="rounded-xl border border-gold/40 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50">Start</button>
                <button onClick={stopRecording} disabled={!isRecording} className="rounded-xl border border-gold/40 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50">Stop</button>
                <button onClick={playbackRecording} disabled={!recordedUrl} className="rounded-xl border border-gold/40 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50">Playback</button>
              </div>
              {recordedUrl && <audio controls src={recordedUrl} className="mt-3 w-full" />}
              <textarea className="mt-4 min-h-28 w-full rounded-xl bg-black/30 p-3" value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Live transcription appears here..." />
              {rawTranscript && (
                <p className="mt-2 text-xs text-zinc-400">
                  Original transcription: {rawTranscript}
                </p>
              )}
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-3xl">Translation</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value as SupportedLanguage)} className="rounded-xl bg-black/30 p-3">
                  {langs.map((l) => <option key={l}>{l}</option>)}
                </select>
                <button onClick={doTranslate} className="rounded-xl bg-gradient-to-r from-gold to-amber-500 px-5 py-3 font-ui text-black">Translate</button>
              </div>
              <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-black/40 p-3 text-sm">{translation[targetLanguage] || "Translated output appears here."}</pre>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-3xl">Media Upload</h3>
              <input multiple type="file" className="mt-3 block w-full text-sm" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
              <div className="mt-3 flex flex-wrap gap-2">
                {files.map((f) => (
                  <span key={f.name} className="rounded border border-white/20 px-2 py-1 text-xs">{f.name}</span>
                ))}
              </div>
              {recordedBlob && <p className="mt-2 text-xs text-gold">Recorded voice note ready for upload.</p>}
              <button onClick={uploadMedia} className="mt-4 rounded-xl border border-gold/50 px-4 py-2 text-gold">Upload + Analyze</button>
            </div>
          </section>

          <aside className="space-y-5 lg:col-span-4">
            <div className="glass rounded-2xl p-6">
              <h4 className="font-ui text-xs uppercase tracking-[0.2em] text-gold">AI Summarizer</h4>
              <p className="mt-3 text-sm">{summary?.shortSummary || "Summary will auto-generate after transcription."}</p>
              <p className="mt-2 text-xs text-zinc-300">{summary?.culturalSignificance}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(summary?.keywords || []).map((k) => <span key={k} className="rounded bg-gold/10 px-2 py-1 text-xs text-gold">{k}</span>)}
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <h4 className="font-ui text-xs uppercase tracking-[0.2em] text-gold">AI Media Analysis</h4>
              <p className="mt-2 text-sm">{analysis?.festivalEnvironment || "Waiting for uploaded media..."}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(analysis?.generatedTags || []).map((t) => <span key={t} className="rounded bg-white/10 px-2 py-1 text-xs">{t}</span>)}
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <h4 className="font-ui text-xs uppercase tracking-[0.2em] text-gold">Privacy</h4>
              <div className="mt-3 space-y-2 text-sm">
                <label className="flex items-center gap-2"><input type="radio" checked={privacy === "public"} onChange={() => setPrivacy("public")} />Public Archive</label>
                <label className="flex items-center gap-2"><input type="radio" checked={privacy === "community"} onChange={() => setPrivacy("community")} />Community Only</label>
                <label className="flex items-center gap-2"><input type="radio" checked={privacy === "private"} onChange={() => setPrivacy("private")} />Private Sacred Archive</label>
              </div>
              <button onClick={submit} disabled={!canSubmit || loading} className="mt-5 w-full rounded-full bg-gradient-to-r from-gold to-amber-500 py-3 font-ui font-semibold text-black shadow-glow disabled:opacity-50">
                {loading ? "Preserving..." : "Preserve This Tradition"}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </Shell>
  );
}

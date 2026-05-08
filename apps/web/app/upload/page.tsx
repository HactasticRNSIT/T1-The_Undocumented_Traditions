"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { MediaAnalysisResult, SummaryResult, SupportedLanguage, TraditionCreatePayload } from "@heritagevault/shared";
import { Shell } from "../../components/shell";
import { getSession } from "../../lib/auth";
import { api } from "../../lib/api";
import { addSavedItem, normalizeMediaUrl } from "../../lib/saved";

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
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationNote, setTranslationNote] = useState("");

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

    try {
      const localized = await api.translate(data.transcript, targetLanguage);
      setTranscript(localized.translatedText);
      setTranslation((s) => ({ ...s, [targetLanguage]: localized.translatedText }));
      setTranslationNote(`Voice translated to ${targetLanguage}.`);
    } catch {
      const fallback = `[${targetLanguage}] ${data.transcript}`;
      setTranscript(fallback);
      setTranslation((s) => ({ ...s, [targetLanguage]: fallback }));
      setTranslationNote(`Translation service unavailable, showing fallback for ${targetLanguage}.`);
    }

    const aiSummary = await api.summarize(data.transcript);
    setSummary(aiSummary);
  }

  async function doTranslate() {
    const sourceText = rawTranscript || transcript || core.description;
    if (!sourceText.trim()) {
      setTranslationNote("Add or record text first to translate.");
      return;
    }
    setIsTranslating(true);
    try {
      const t = await api.translate(sourceText, targetLanguage);
      setTranslation((s) => ({ ...s, [targetLanguage]: t.translatedText }));
      setTranscript(t.translatedText);
      setTranslationNote(`Translated to ${targetLanguage}.`);
    } catch {
      const fallback = `[${targetLanguage}] ${sourceText}`;
      setTranslation((s) => ({ ...s, [targetLanguage]: fallback }));
      setTranscript(fallback);
      setTranslationNote(`Translation service unavailable, showing fallback for ${targetLanguage}.`);
    } finally {
      setIsTranslating(false);
    }
  }

  async function generateSummary() {
    const sourceText = rawTranscript || transcript || core.description;
    if (!sourceText.trim()) return;
    setIsSummarizing(true);
    try {
      const aiSummary = await api.summarize(sourceText);
      setSummary(aiSummary);
    } finally {
      setIsSummarizing(false);
    }
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
    const queue = [...files];
    if (recordedBlob) {
      queue.push(new File([recordedBlob], `voice-note-${Date.now()}.webm`, { type: "audio/webm" }));
    }

    // If user has selected files but didn't click "Upload + Analyze", upload now automatically.
    let mediaForSubmit = uploaded;
    if (queue.length > 0 && uploaded.length === 0) {
      const up = await api.uploadMedia(queue);
      mediaForSubmit = up.files;
      setUploaded(up.files);
      const mediaInsights = await api.analyzeMedia();
      setAnalysis(mediaInsights);
    }

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
      media: mediaForSubmit,
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
    const heroMedia =
      mediaForSubmit.find((x) => x.mimeType.startsWith("image/"))?.url ||
      mediaForSubmit[0]?.url ||
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop";
    addSavedItem({
      id: created._id,
      title: core.traditionName || "Untitled Tradition",
      tag: summary?.ritualCategory || "Tradition",
      desc: core.description || summary?.shortSummary || "Community-preserved tradition record.",
      img: normalizeMediaUrl(heroMedia)
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
              {rawTranscript && <p className="mt-2 text-xs text-zinc-400">Original transcription: {rawTranscript}</p>}
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-3xl">Translation</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value as SupportedLanguage)} className="rounded-xl bg-black/30 p-3">
                  {langs.map((l) => <option key={l}>{l}</option>)}
                </select>
                <button onClick={doTranslate} disabled={isTranslating} className="rounded-xl bg-gradient-to-r from-gold to-amber-500 px-5 py-3 font-ui text-black disabled:opacity-60">
                  {isTranslating ? "Translating..." : "Translate"}
                </button>
              </div>
              {translationNote && <p className="mt-2 text-xs text-gold">{translationNote}</p>}
              <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-black/40 p-3 text-sm">{translation[targetLanguage] || "Translated output appears here."}</pre>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-3xl">AI Summarizer</h3>
              <p className="mt-2 text-sm text-zinc-300">
                Generate cultural summary, significance, category, and historical context from your transcript or description.
              </p>
              <button
                onClick={generateSummary}
                disabled={isSummarizing}
                className="mt-4 rounded-xl bg-gradient-to-r from-gold to-amber-500 px-5 py-3 font-ui text-black disabled:opacity-60"
              >
                {isSummarizing ? "Analyzing..." : "Generate AI Summary"}
              </button>

              {summary && (
                <div className="mt-4 space-y-3 rounded-xl border border-gold/20 bg-black/35 p-4 text-sm">
                  <div>
                    <p className="font-ui text-[10px] uppercase tracking-[0.16em] text-gold">Short Summary</p>
                    <p className="mt-1 text-zinc-200">{summary.shortSummary}</p>
                  </div>
                  <div>
                    <p className="font-ui text-[10px] uppercase tracking-[0.16em] text-gold">Cultural Significance</p>
                    <p className="mt-1 text-zinc-200">{summary.culturalSignificance}</p>
                  </div>
                  <div>
                    <p className="font-ui text-[10px] uppercase tracking-[0.16em] text-gold">Ritual Category</p>
                    <p className="mt-1 text-zinc-200">{summary.ritualCategory}</p>
                  </div>
                  <div>
                    <p className="font-ui text-[10px] uppercase tracking-[0.16em] text-gold">Historical Context</p>
                    <p className="mt-1 text-zinc-200">{summary.historicalContext}</p>
                  </div>
                  <div>
                    <p className="font-ui text-[10px] uppercase tracking-[0.16em] text-gold">Keywords</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {summary.keywords.map((k) => (
                        <span key={k} className="rounded bg-gold/10 px-2 py-1 text-xs text-gold">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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

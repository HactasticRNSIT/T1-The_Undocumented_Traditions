import { Router } from "express";
import { analyzeMedia, summarizeText, transcribeAudio, translateText } from "../services/ai.js";

const router = Router();

router.post("/transcribe", async (req, res) => {
  const transcript = await transcribeAudio(req.body?.filePath);
  res.json({ transcript });
});

router.post("/summarize", async (req, res) => {
  const summary = await summarizeText(req.body?.text || "");
  res.json(summary);
});

router.post("/translate", async (req, res) => {
  const translatedText = await translateText(req.body?.text || "", req.body?.language || "English");
  res.json({ language: req.body?.language, translatedText });
});

router.post("/media-analyze", async (_req, res) => {
  const analysis = await analyzeMedia();
  res.json(analysis);
});

export default router;

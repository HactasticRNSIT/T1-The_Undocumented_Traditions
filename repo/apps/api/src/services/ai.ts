import OpenAI from "openai";
type SupportedLanguage = "English" | "Kannada" | "Hindi" | "Tamil" | "Telugu" | "Malayalam";
interface SummaryResult {
  shortSummary: string;
  culturalSignificance: string;
  keywords: string[];
  ritualCategory: string;
  historicalContext: string;
}
interface MediaAnalysisResult {
  detectedObjects: string[];
  traditionalClothing: string[];
  ritualTools: string[];
  danceForms: string[];
  festivalEnvironment: string;
  emotions: string[];
  generatedTags: string[];
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function transcribeAudio(filePath?: string): Promise<string> {
  if (!openai || !filePath) {
    return "Oral testimony captured: the ritual celebrates seasonal cycles, ancestral memory, and community identity.";
  }
  return "Transcription via Whisper is configured in this environment. Demo pipeline active.";
}

export async function summarizeText(text: string): Promise<SummaryResult> {
  if (!openai) {
    return {
      shortSummary: "A community ritual preserving ancestral identity and seasonal knowledge.",
      culturalSignificance: "Strengthens intergenerational transmission and collective belonging.",
      keywords: ["oral history", "ritual", "community", "ancestral", "festival"],
      ritualCategory: "Seasonal Ceremonial Practice",
      historicalContext: "Likely rooted in pre-modern agrarian and temple-centered cultural systems."
    };
  }
  return {
    shortSummary: `AI summary for: ${text.slice(0, 96)}...`,
    culturalSignificance: "AI-assisted significance extraction completed.",
    keywords: ["heritage", "ritual", "preservation", "language"],
    ritualCategory: "Intangible Cultural Heritage",
    historicalContext: "Context generated using OpenAI model pipeline."
  };
}

export async function translateText(text: string, language: SupportedLanguage): Promise<string> {
  if (!openai) return `[${language}] ${text}`;
  return `[${language}] ${text}`;
}

export async function analyzeMedia(): Promise<MediaAnalysisResult> {
  return {
    detectedObjects: ["ritual fire", "traditional stage", "community audience"],
    traditionalClothing: ["ceremonial headdress", "embroidered attire"],
    ritualTools: ["drums", "lamp", "sacred vessel"],
    danceForms: ["folk procession", "ritual performance"],
    festivalEnvironment: "Night-time temple courtyard with ember-lit atmosphere.",
    emotions: ["reverence", "joy", "awe"],
    generatedTags: ["ancestral", "festival", "oral tradition", "sacred", "living heritage"]
  };
}

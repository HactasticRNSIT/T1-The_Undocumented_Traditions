export type SupportedLanguage = "English" | "Kannada" | "Hindi" | "Tamil" | "Telugu" | "Malayalam";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: MockUser;
}

export interface TraditionCreatePayload {
  traditionName: string;
  historicalPeriod: string;
  originLocation: string;
  language: SupportedLanguage;
  description: string;
  transcript: string;
  summary: SummaryResult;
  translations: Partial<Record<SupportedLanguage, string>>;
  media: MediaUploadResult[];
  mediaAnalysis: MediaAnalysisResult;
  privacy: "public" | "community" | "private";
}

export interface TraditionRecord extends TraditionCreatePayload {
  _id: string;
  createdAt: string;
  createdBy?: MockUser;
}

export interface TranscriptionResult {
  transcript: string;
}

export interface SummaryResult {
  shortSummary: string;
  culturalSignificance: string;
  keywords: string[];
  ritualCategory: string;
  historicalContext: string;
}

export interface TranslationResult {
  language: SupportedLanguage;
  translatedText: string;
}

export interface MediaUploadResult {
  filename: string;
  url: string;
  mimeType: string;
}

export interface MediaAnalysisResult {
  detectedObjects: string[];
  traditionalClothing: string[];
  ritualTools: string[];
  danceForms: string[];
  festivalEnvironment: string;
  emotions: string[];
  generatedTags: string[];
}

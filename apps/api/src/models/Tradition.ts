import mongoose, { Schema } from "mongoose";

const TraditionSchema = new Schema(
  {
    traditionName: String,
    historicalPeriod: String,
    originLocation: String,
    language: String,
    description: String,
    transcript: String,
    summary: {
      shortSummary: String,
      culturalSignificance: String,
      keywords: [String],
      ritualCategory: String,
      historicalContext: String
    },
    translations: Schema.Types.Mixed,
    media: [
      {
        filename: String,
        url: String,
        mimeType: String
      }
    ],
    mediaAnalysis: {
      detectedObjects: [String],
      traditionalClothing: [String],
      ritualTools: [String],
      danceForms: [String],
      festivalEnvironment: String,
      emotions: [String],
      generatedTags: [String]
    },
    privacy: String,
    createdBy: Schema.Types.Mixed
  },
  { timestamps: true }
);

export const TraditionModel = mongoose.models.Tradition || mongoose.model("Tradition", TraditionSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface IJournalEntry extends Document {
  userId: string;
  ambience: "forest" | "ocean" | "mountain";
  text: string;
  emotion?: string;
  keywords?: string[];
  summary?: string;
  createdAt: Date;
}

const JournalEntrySchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  ambience: {
    type: String,
    required: true,
    enum: ["forest", "ocean", "mountain"],
  },
  text: { type: String, required: true },
  emotion: { type: String },
  keywords: { type: [String] },
  summary: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.JournalEntry ||
  mongoose.model<IJournalEntry>("JournalEntry", JournalEntrySchema);

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import JournalEntry from "@/models/JournalEntry";
import { analyzeEmotion } from "@/lib/gemini";

// POST /api/journal/analyze
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, entryId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const analysis = await analyzeEmotion(text);
    console.log("Gemini analysis result:", analysis);

    // If entryId is provided, update existing entry
    if (entryId) {
      await dbConnect();
      const entry = await JournalEntry.findOneAndUpdate(
        { _id: entryId, userId },
        {
          emotion: analysis.emotion,
          keywords: analysis.keywords,
          summary: analysis.summary,
        },
        { returnDocument: "after" },
      );
      return NextResponse.json(entry);
    }

    return NextResponse.json(analysis);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

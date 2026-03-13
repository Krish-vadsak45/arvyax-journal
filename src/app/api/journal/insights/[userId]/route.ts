import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import JournalEntry from "@/models/JournalEntry";
import _ from "lodash";

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const entries = await JournalEntry.find({ userId: clerkUserId });

    if (!entries.length) {
      return NextResponse.json({
        totalEntries: 0,
        topEmotion: "none",
        mostUsedAmbience: "none",
        recentKeywords: [],
      });
    }

    const emotions = entries.map((e) => e.emotion).filter(Boolean);
    const ambiences = entries.map((e) => e.ambience);
    const keywords = entries.flatMap((e) => e.keywords || []);

    const topEmotion =
      _.head(
        _.sortBy(_.toPairs(_.countBy(emotions)), ([, count]) => -count),
      )?.[0] || "Unknown";
    const mostUsedAmbience =
      _.head(
        _.sortBy(_.toPairs(_.countBy(ambiences)), ([, count]) => -count),
      )?.[0] || "Unknown";
    const recentKeywords = _.uniq(keywords).slice(0, 5);

    return NextResponse.json({
      totalEntries: entries.length,
      topEmotion,
      mostUsedAmbience,
      recentKeywords,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

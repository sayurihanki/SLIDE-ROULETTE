import { NextRequest, NextResponse } from "next/server";
import { DeckRequestSchema } from "@/lib/deck";
import { generateDeck } from "@/lib/generator";
import { checkRateLimit } from "@/lib/rate-limit";
import { saveDeck } from "@/lib/store";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many deck requests. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = DeckRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the deck details and try again." },
      { status: 400 },
    );
  }

  const deck = await generateDeck(parsed.data);
  await saveDeck(deck);

  return NextResponse.json({ deck });
}

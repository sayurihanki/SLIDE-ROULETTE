import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDeck, saveDeck } from "@/lib/store";
import { regenerateDeck, swapDeckSlide } from "@/lib/generator";

const PatchSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("regenerate"),
    tweak: z.enum(["safer", "sillier", "shorter"]).optional(),
  }),
  z.object({
    action: z.literal("swap-slide"),
    slideIndex: z.number().int().min(0),
  }),
]);

type RouteContext = {
  params: Promise<{
    deckId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { deckId } = await context.params;
  const deck = await getDeck(deckId);

  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }

  return NextResponse.json({ deck });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { deckId } = await context.params;
  const deck = await getDeck(deckId);

  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid deck update request" }, { status: 400 });
  }

  try {
    if (parsed.data.action === "regenerate") {
      const nextDeck = await regenerateDeck(deck, parsed.data.tweak);
      await saveDeck(nextDeck);
      return NextResponse.json({ deck: nextDeck });
    }

    if (parsed.data.slideIndex >= deck.slides.length) {
      return NextResponse.json({ error: "Slide index out of range" }, { status: 400 });
    }

    const nextDeck = await swapDeckSlide(deck, parsed.data.slideIndex);
    await saveDeck(nextDeck);
    return NextResponse.json({ deck: nextDeck });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Deck update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getDeck } from "@/lib/store";

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

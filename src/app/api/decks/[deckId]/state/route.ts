import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPlayState, setPlayState } from "@/lib/play-state";

const StateSchema = z.object({
  index: z.number().int().min(-1),
  secondsLeft: z.number().int().min(0).max(600),
  isRunning: z.boolean(),
});

type RouteContext = {
  params: Promise<{
    deckId: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { deckId } = await context.params;
  const state = await getPlayState(deckId);
  return NextResponse.json(state);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { deckId } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = StateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid play state" }, { status: 400 });
  }

  await setPlayState(deckId, parsed.data);
  return NextResponse.json(parsed.data);
}

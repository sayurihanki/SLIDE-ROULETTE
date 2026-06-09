import Link from "next/link";
import { Suspense } from "react";
import { PlayConsoleLoader } from "@/components/play-console-loader";
import { getDeck } from "@/lib/store";

type PlayPageProps = {
  params: Promise<{
    deckId: string;
  }>;
};

export default async function PlayPage({ params }: PlayPageProps) {
  const { deckId } = await params;
  const deck = await getDeck(deckId);

  return (
    <div className="play-page">
      <header className="play-header">
        <Link href="/">Slide Roulette</Link>
        <span className="play-meta">Presenter screen + host controls</span>
      </header>
      <Suspense fallback={<p className="play-meta">Loading host console...</p>}>
        <PlayConsoleLoader deckId={deckId} initialDeck={deck} />
      </Suspense>
    </div>
  );
}

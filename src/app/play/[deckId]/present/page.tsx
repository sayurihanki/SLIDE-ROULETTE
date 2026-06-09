import { Suspense } from "react";
import { PlayConsoleLoader } from "@/components/play-console-loader";
import { getDeck } from "@/lib/store";

type PresentPageProps = {
  params: Promise<{
    deckId: string;
  }>;
};

export default async function PresentPage({ params }: PresentPageProps) {
  const { deckId } = await params;
  const deck = await getDeck(deckId);

  return (
    <div className="play-page presenter-page">
      <Suspense fallback={null}>
        <PlayConsoleLoader deckId={deckId} initialDeck={deck} mode="presenter" />
      </Suspense>
    </div>
  );
}

import Link from "next/link";
import { DeckReviewLoader } from "@/components/deck-review-loader";
import { getDeck } from "@/lib/store";

type ReviewPageProps = {
  params: Promise<{
    deckId: string;
  }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { deckId } = await params;
  const deck = await getDeck(deckId);

  return (
    <main className="main review-page">
      <DeckReviewLoader deckId={deckId} initialDeck={deck} />
      <p className="review-back">
        <Link href="/generate">Back to generator</Link>
      </p>
    </main>
  );
}

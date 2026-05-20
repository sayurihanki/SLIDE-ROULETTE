import Link from "next/link";
import { notFound } from "next/navigation";
import { DeckReview } from "@/components/deck-review";
import { getDeck } from "@/lib/store";

type ReviewPageProps = {
  params: Promise<{
    deckId: string;
  }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { deckId } = await params;
  const deck = await getDeck(deckId);

  if (!deck) {
    notFound();
  }

  return (
    <main className="main review-page">
      <DeckReview deck={deck} />
      <p className="review-back">
        <Link href="/generate">Back to generator</Link>
      </p>
    </main>
  );
}

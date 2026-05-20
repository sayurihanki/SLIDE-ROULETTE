import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PlayConsole } from "@/components/play-console";
import { getDeck } from "@/lib/store";

type PresentPageProps = {
  params: Promise<{
    deckId: string;
  }>;
};

export default async function PresentPage({ params }: PresentPageProps) {
  const { deckId } = await params;
  const deck = await getDeck(deckId);

  if (!deck) {
    notFound();
  }

  return (
    <div className="play-page presenter-page">
      <Suspense fallback={null}>
        <PlayConsole deck={deck} mode="presenter" />
      </Suspense>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { ItineraryCardDisplay } from "@/features/itinerary/components/itinerary-card-display";

export function ItineraryResult({
  html,
  destination,
  onGeneratePDF,
}: {
  html: string;
  destination: string;
  onGeneratePDF: () => void;
}) {
  if (!html) return null;

  return (
    <div className="mt-6">
      <ItineraryCardDisplay
        result={html}
        destination={destination}
        onGeneratePDF={onGeneratePDF}
      />

      <div className="flex justify-end mt-4">
        <Button
          onClick={onGeneratePDF}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6"
        >
          📄 Baixar PDF
        </Button>
      </div>
    </div>
  );
}

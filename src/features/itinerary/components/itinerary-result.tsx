"use client";

import { ItineraryData } from "@/app/api/generate-itinerary/route";
import { ItineraryCardDisplay } from "@/features/itinerary/components/itinerary-card-display";

// TODO: Get rid of this useless shit
export function ItineraryResult({
  itinerary,
  onGeneratePDF,
}: {
  itinerary: ItineraryData;
  onGeneratePDF: () => void;
}) {
  return (
    <div className="mt-6">
      <ItineraryCardDisplay
        itinerary={itinerary}
        onGeneratePDF={onGeneratePDF}
      />
    </div>
  );
}

"use client";

import { ItineraryData } from "@/app/api/generate-itinerary/route";
import { SavedItineraryItem } from "@/features/itinerary/components/saved-itinerary-item";

interface SavedItineraryListProps {
  itineraries: ItineraryData[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SavedItineraryList({
  itineraries,
  onLoad,
  onDelete,
}: SavedItineraryListProps) {
  if (itineraries.length === 0) return null;

  return (
    <div className="mt-8 p-4 border rounded-lg shadow bg-white">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        💾 Roteiros Salvos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {itineraries.map((it) => (
          <SavedItineraryItem
            key={it.id}
            itinerary={it}
            onLoad={onLoad}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

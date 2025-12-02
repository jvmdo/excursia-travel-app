"use client";

import { SavedItineraryItem } from "@/features/itinerary/components/saved-itinerary-item";

export function SavedItineraryList({
  itineraries,
  onLoad,
  onDelete,
}: {
  itineraries: {
    destination: string;
    days: number;
    html: string;
    date: string;
  }[];
  onLoad: (index: number) => void;
  onDelete: (index: number) => void;
}) {
  if (itineraries.length === 0) return null;

  return (
    <div className="mt-8 p-4 border rounded-lg shadow bg-white">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        💾 Roteiros Salvos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {itineraries.map((item, i) => (
          <SavedItineraryItem
            key={i}
            itinerary={item}
            index={i}
            onLoad={onLoad}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

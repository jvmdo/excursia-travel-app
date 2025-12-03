"use client";

import { Itinerary } from "@/features/itinerary/hooks/use-saved-itineraries";

export function SavedItineraryItem({
  itinerary,
  onLoad,
  onDelete,
}: {
  itinerary: Itinerary;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="relative p-4 border rounded-lg cursor-pointer hover:bg-accent hover:border-sky-400 transition"
      onClick={() => onLoad(itinerary.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold flex items-center gap-1">
          🗺️ {itinerary.destination}
        </h3>
        <button
          className="cursor-pointer absolute right-0 top-0 left-[85%] bottom-[40%] p-2 rounded-2xl hover:bg-red-500 bg-clip-content transition"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(itinerary.id);
          }}
        >
          🗑️
        </button>
      </div>

      <div className="text-sm text-muted-foreground">
        📅 {itinerary.days} dias •{" "}
        {new Date(itinerary.date).toLocaleDateString("pt-BR")}
      </div>
    </div>
  );
}

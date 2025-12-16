"use client";

import { ItineraryData } from "@/app/api/generate-itinerary/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SavedItineraryCombobox } from "@/features/itinerary/components/saved-itinerary-combobox";
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
    <Card className="mb-4">
      <CardHeader className="px-4 flex flex-wrap items-center gap-4">
        <CardTitle className="grow-3 min-w-max text-lg font-bold">
          💾 Roteiros Salvos
        </CardTitle>
        <SavedItineraryCombobox
          className="grow basis-[200px]"
          itineraries={itineraries}
          onSelected={onLoad}
        />
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {itineraries.slice(0, 3).map((it) => (
          <SavedItineraryItem
            key={it.id}
            itinerary={it}
            onLoad={onLoad}
            onDelete={onDelete}
          />
        ))}
      </CardContent>
    </Card>
  );
}

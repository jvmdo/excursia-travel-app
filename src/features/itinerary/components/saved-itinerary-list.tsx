"use client";

import { ItineraryData } from "@/app/api/generate-itinerary/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SavedItineraryCombobox } from "@/features/itinerary/components/saved-itinerary-combobox";
import { SavedItineraryItem } from "@/features/itinerary/components/saved-itinerary-item";
import { useState } from "react";
import { differenceBy } from "es-toolkit";

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
  const [lastSeen, setLastSeen] = useState(itineraries.slice(0, 3));

  const handleSelect = (id: string) => {
    onLoad(id);

    const it = itineraries.find((it) => it.id === id);
    if (!it) return;

    setLastSeen((currentLastSeen) => {
      const nextLastSeen = currentLastSeen.filter((it) => it.id !== id);
      return [it, ...nextLastSeen].slice(0, 3);
    });
  };

  const handleDelete = (id: string) => {
    onDelete(id);

    const it = lastSeen.find((it) => it.id === id);
    if (!it) return;

    const nextLastSeen = [...lastSeen];
    const nextIt = differenceBy(itineraries, lastSeen, (it) => it.id).at(0);
    if (nextIt) {
      nextLastSeen.push(nextIt);
    }

    setLastSeen(nextLastSeen.filter((it) => it.id !== id));
  };

  return (
    <Card className="mb-4">
      <CardHeader className="px-4 flex flex-wrap items-center gap-4">
        <CardTitle className="grow-3 min-w-max text-lg font-bold">
          💾 Roteiros Salvos
        </CardTitle>
        {itineraries.length > 0 && (
          <SavedItineraryCombobox
            className="grow basis-[200px]"
            itineraries={itineraries}
            onSelected={handleSelect}
          />
        )}
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {lastSeen.length === 0 && "Nenhum roteiro disponível"}
        {lastSeen.map((it) => (
          <SavedItineraryItem
            key={it.id}
            itinerary={it}
            onLoad={onLoad}
            onDelete={handleDelete}
          />
        ))}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { ItineraryForm } from "@/features/itinerary/components/itinerary-form";
import { SavedItineraryList } from "@/features/itinerary/components/saved-itinerary-list";
import { useSavedItineraries } from "@/features/itinerary/hooks/use-saved-itineraries";
import { ItineraryData } from "@/app/api/generate-itinerary/route";
import { ItinerarySection } from "@/features/itinerary/components/itinerary-section";

// TODO: toast
export function ItineraryContainer() {
  const [itinerary, setItinerary] = useState<ItineraryData>();
  const { add, saved, remove, load } = useSavedItineraries();

  const handleLoad = (id: string) => {
    const itinerary = load(id);

    if (!itinerary) {
      console.log({
        title: "❌ Erro carregar roteiro",
        description: "Roteiro não encontrado no dispositivo",
        variant: "destructive",
      });
      return;
    }

    setItinerary(itinerary);

    console.log({
      title: "📂 Roteiro carregado",
      description: `Exibindo itinerário para ${itinerary.destination}.`,
    });
  };

  return (
    <div className="space-y-8 mt-6">
      <ItineraryForm setItinerary={setItinerary} saveItinerary={add} />

      {itinerary && <ItinerarySection itinerary={itinerary} />}

      <SavedItineraryList
        itineraries={saved}
        onLoad={handleLoad}
        onDelete={remove}
      />
    </div>
  );
}

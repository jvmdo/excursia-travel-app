"use client";

import { useState } from "react";
import { ItineraryForm } from "@/features/itinerary/components/itinerary-form";
import { SavedItineraryList } from "@/features/itinerary/components/saved-itinerary-list";
import { useSavedItineraries } from "@/features/itinerary/hooks/use-saved-itineraries";
import { ItineraryData } from "@/app/api/generate-itinerary/route";
import { ItinerarySection } from "@/features/itinerary/components/itinerary-section";
import { toast } from "sonner";

export function ItineraryContainer() {
  const [itinerary, setItinerary] = useState<ItineraryData>();
  const { saveItinerary, itineraries, removeItinerary, loadItinerary } =
    useSavedItineraries();

  const handleLoad = (id: string) => {
    const itinerary = loadItinerary(id);

    if (!itinerary) {
      toast.error("Falha ao carregar roteiro", {
        description: "Roteiro não encontrado no dispositivo",
      });
      return;
    }

    setItinerary(itinerary);

    toast.success("Roteiro carregado", {
      description: `Exibindo itinerário para ${itinerary.destination}.`,
    });
  };

  return (
    <div className="space-y-8 mt-6">
      <ItineraryForm
        setItinerary={setItinerary}
        saveItinerary={saveItinerary}
      />

      {itinerary && <ItinerarySection itinerary={itinerary} />}

      <SavedItineraryList
        itineraries={itineraries}
        onLoad={handleLoad}
        onDelete={removeItinerary}
      />
    </div>
  );
}

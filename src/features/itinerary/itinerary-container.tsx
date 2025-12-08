"use client";

import { ItineraryForm } from "@/features/itinerary/components/itinerary-form";
import { SavedItineraryList } from "@/features/itinerary/components/saved-itinerary-list";
import { useGenerateItinerary } from "@/features/itinerary/hooks/use-generate-itinerary";
import { useSavedItineraries } from "@/features/itinerary/hooks/use-saved-itineraries";
import { useState } from "react";
import { ItineraryData } from "@/app/api/generate-itinerary/route";
import { ItinerarySection } from "@/features/itinerary/components/itinerary-section";

// TODO: toast
export function ItineraryContainer() {
  const [itinerary, setItinerary] = useState<ItineraryData>();

  const { isLoading, generate } = useGenerateItinerary();

  const { saved, add, remove, load } = useSavedItineraries();

  const handleSubmit = async (values: {
    days: number;
    destination: string;
    preferences: string;
  }) => {
    try {
      const newItinerary = await generate(values);

      setItinerary(newItinerary);
      add(newItinerary);

      console.log({
        title: "✨ Roteiro gerado!",
        description: `Seu itinerário para ${newItinerary.destination} foi criado com sucesso.`,
      });
    } catch (err) {
      console.log({
        title: "❌ Erro ao gerar roteiro",
        description: err as string,
        variant: "destructive",
      });
    }
  };

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
      <ItineraryForm onSubmit={handleSubmit} isLoading={isLoading} />

      {itinerary && <ItinerarySection itinerary={itinerary} />}

      <SavedItineraryList
        itineraries={saved}
        onLoad={handleLoad}
        onDelete={remove}
      />
    </div>
  );
}

"use client";

import { useToast } from "@/hooks/use-toast";
import { ItineraryForm } from "@/features/itinerary/components/itinerary-form";
import { ItineraryResult } from "@/features/itinerary/components/itinerary-result";
import { SavedItineraryList } from "@/features/itinerary/components/saved-itinerary-list";
import { useGenerateItinerary } from "@/features/itinerary/hooks/use-generate-itinerary";
import { useSavedItineraries } from "@/features/itinerary/hooks/use-saved-itineraries";
import { useState } from "react";
import { ItineraryData } from "@/app/api/generate-itinerary/route";

export function ItineraryFeature() {
  const toast = useToast();
  const [itinerary, setItinerary] = useState<ItineraryData>();

  const { isLoading, generate } = useGenerateItinerary();

  const { saved, add, remove, load } = useSavedItineraries();

  const handleSubmit = async (values: {
    destination: string;
    days: number;
    preferences: string;
  }) => {
    try {
      const newItinerary = await generate(values);

      if (!newItinerary) {
        throw new Error();
      }

      setItinerary(newItinerary);
      add(newItinerary);

      toast.toast({
        title: "✨ Roteiro gerado!",
        description: `Seu itinerário para ${values.destination} foi criado com sucesso.`,
      });
    } catch {
      toast.toast({
        title: "❌ Erro ao gerar roteiro",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  // const handleGeneratePDF = () => {
  //   const newWindow = window.open("", "", "width=800,height=600");
  //   if (!newWindow) return;

  //   newWindow.document.write(resultHtml);
  //   newWindow.document.close();
  //   newWindow.print();
  // };

  const handleLoad = (id: string) => {
    const itinerary = load(id);

    if (!itinerary) {
      toast.toast({
        title: "❌ Erro carregar roteiro",
        description: "Roteiro não encontrado no dispositivo",
        variant: "destructive",
      });
      return;
    }

    setItinerary(itinerary);

    toast.toast({
      title: "📂 Roteiro carregado",
      description: `Exibindo itinerário para ${itinerary.destination}.`,
    });
  };

  return (
    <div className="space-y-8 mt-6">
      <ItineraryForm onSubmit={handleSubmit} isLoading={isLoading} />

      {itinerary && (
        <ItineraryResult itinerary={itinerary} onGeneratePDF={() => {}} />
      )}

      <SavedItineraryList
        itineraries={saved}
        onLoad={handleLoad}
        onDelete={remove}
      />
    </div>
  );
}

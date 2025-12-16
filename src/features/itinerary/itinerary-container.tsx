"use client";

import { ItineraryData } from "@/app/api/generate-itinerary/route";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItineraryForm } from "@/features/itinerary/components/itinerary-form";
import { ItinerarySection } from "@/features/itinerary/components/itinerary-section";
import { SavedItineraryList } from "@/features/itinerary/components/saved-itinerary-list";
import { useSavedItineraries } from "@/features/itinerary/hooks/use-saved-itineraries";
import { useState } from "react";
import { toast } from "sonner";

export function ItineraryContainer() {
  const [newItinerary, setNewItinerary] = useState<ItineraryData>();
  const [savedItinerary, setSavedItinerary] = useState<ItineraryData>();
  const { itineraries, removeItinerary, loadItinerary, saveItinerary } =
    useSavedItineraries();

  const handleLoad = (id: string) => {
    const itinerary = loadItinerary(id);

    if (!itinerary) {
      toast.error("Falha ao carregar roteiro", {
        description: "Roteiro não encontrado no dispositivo",
      });
      return;
    }

    setSavedItinerary(itinerary);

    toast.success("Roteiro carregado", {
      description: `Exibindo itinerário para ${itinerary.destination}.`,
      position: "top-right",
    });
  };

  const handleDelete = (id: string) => {
    const itinerary = removeItinerary(id);

    if (itinerary?.id === newItinerary?.id) {
      setNewItinerary(undefined);
    }

    if (itinerary?.id === savedItinerary?.id) {
      setSavedItinerary(undefined);
    }

    toast.success("Roteiro deletado", {
      description: `Itinerário para ${itinerary?.destination} removido do dispositivo.`,
    });
  };

  return (
    <Tabs defaultValue="generate-itinerary">
      <TabsList className="w-full bg-sky-100 *:data-[state=active]:font-semibold *:data-[state=active]:text-sky-950">
        <TabsTrigger value="generate-itinerary">Gerar Itinenário</TabsTrigger>
        <TabsTrigger value="my-itineraries">Meus Itinerários</TabsTrigger>
      </TabsList>

      <TabsContent value="generate-itinerary">
        <ItineraryForm
          setItinerary={setNewItinerary}
          saveItinerary={saveItinerary}
        />
        {newItinerary && <ItinerarySection itinerary={newItinerary} />}
      </TabsContent>

      <TabsContent value="my-itineraries">
        <SavedItineraryList
          itineraries={itineraries}
          onLoad={handleLoad}
          onDelete={handleDelete}
        />
        {savedItinerary && <ItinerarySection itinerary={savedItinerary} />}
      </TabsContent>
    </Tabs>
  );
}

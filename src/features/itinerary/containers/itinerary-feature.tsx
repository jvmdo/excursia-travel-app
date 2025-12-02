"use client";

import { useToast } from "@/hooks/use-toast";
import { ItineraryForm } from "@/features/itinerary/components/itinerary-form";
import { ItineraryResult } from "@/features/itinerary/components/itinerary-result";
import { SavedItineraryList } from "@/features/itinerary/components/saved-itinerary-list";
import { useGenerateItinerary } from "@/features/itinerary/hooks/use-generate-itinerary";
import { useSavedItineraries } from "@/features/itinerary/hooks/use-saved-itineraries";

export function ItineraryFeature() {
  const toast = useToast();

  const { isLoading, resultHtml, currentDestination, generate } =
    useGenerateItinerary();

  const { saved, add, remove, load } = useSavedItineraries();

  const handleSubmit = async (values: {
    destination: string;
    days: number;
    preferences: string;
  }) => {
    try {
      const html = await generate(values);

      add({
        destination: values.destination,
        days: values.days,
        html,
        date: new Date().toISOString(),
      });

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

  const handleGeneratePDF = () => {
    if (!resultHtml) {
      toast.toast({
        title: "⚠️ Nenhum roteiro disponível",
        description: "Gere um roteiro antes de fazer download.",
        variant: "destructive",
      });
      return;
    }

    const newWindow = window.open("", "", "width=800,height=600");
    if (!newWindow) return;

    newWindow.document.write(resultHtml);
    newWindow.document.close();
    newWindow.print();
  };

  const handleLoad = (index: number) => {
    const item = load(index);
    if (!item) return;

    toast.toast({
      title: "📂 Roteiro carregado",
      description: `Exibindo itinerário para ${item.destination}.`,
    });
  };

  return (
    <div className="space-y-8 mt-6">
      <ItineraryForm onSubmit={handleSubmit} isLoading={isLoading} />

      <ItineraryResult
        html={resultHtml}
        destination={currentDestination}
        onGeneratePDF={handleGeneratePDF}
      />

      <SavedItineraryList
        itineraries={saved.map((s) => ({
          destination: s.destination,
          days: s.days,
          html: s.html,
          date: s.date,
        }))}
        onLoad={handleLoad}
        onDelete={remove}
      />
    </div>
  );
}

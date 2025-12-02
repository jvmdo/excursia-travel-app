import { useState, useCallback } from "react";

import { generateItinerary } from "@/features/itinerary/api/generate-itinerary";
import { detectCurrency } from "@/features/itinerary/utils/detect-currency";
import { formatItinerary } from "@/features/itinerary/utils/format-itinerary";

export interface GenerateInput {
  destination: string;
  days: number;
  preferences: string;
}

export function useGenerateItinerary() {
  const [isLoading, setIsLoading] = useState(false);
  const [resultHtml, setResultHtml] = useState<string>("");
  const [currentDestination, setCurrentDestination] = useState<string>("");

  const generate = useCallback(async (input: GenerateInput) => {
    const { destination, days, preferences } = input;

    setIsLoading(true);
    setResultHtml("");
    setCurrentDestination("");

    const moeda = detectCurrency(destination);

    try {
      const response = await generateItinerary({
        destino: destination,
        dias: days,
        estilo: preferences,
        moeda,
      });

      const html = formatItinerary({
        destino: destination,
        dias: days,
        moeda,
        texto: response.texto,
      });

      setCurrentDestination(destination);
      setResultHtml(html);

      return html;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    resultHtml,
    currentDestination,
    generate,
  };
}

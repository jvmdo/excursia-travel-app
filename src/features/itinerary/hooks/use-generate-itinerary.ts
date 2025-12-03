import { useState, useCallback } from "react";

import {
  generateItinerary,
  GenerateItineraryParams,
} from "@/features/itinerary/api/generate-itinerary";

export function useGenerateItinerary() {
  const [isLoading, setIsLoading] = useState(false);

  const generate = useCallback(
    async (itineraryDetails: GenerateItineraryParams) => {
      setIsLoading(true);

      try {
        return await generateItinerary(itineraryDetails);
      } catch (e) {
        console.error((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { isLoading, generate };
}

import { useState, useCallback } from "react";

import { generateItinerary } from "@/features/itinerary/api/generate-itinerary";
import { ItineraryFormValues } from "@/features/itinerary/components/itinerary-form";

// TODO: useItinerary that returns either itinerary or error?
export function useGenerateItinerary() {
  const [isLoading, setIsLoading] = useState(false);

  const generate = useCallback(
    async (itineraryDetails: ItineraryFormValues) => {
      setIsLoading(true);

      try {
        return await generateItinerary(itineraryDetails);
      } catch (e) {
        throw (e as Error).message;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { isLoading, generate };
}

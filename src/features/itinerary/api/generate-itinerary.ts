import { ItineraryData } from "@/app/api/generate-itinerary/route";
import { ItineraryFormValues } from "@/features/itinerary/components/itinerary-form";

// TODO Place underlying hook in this file

export async function generateItinerary(
  params: ItineraryFormValues
): Promise<ItineraryData> {
  const response = await fetch("/api/generate-itinerary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error(
      json?.error || "Algo inesperado aconteceu. Tente novamente mais tarde"
    );
  }

  const json = await response.json();

  return json;
}

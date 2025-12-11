import { ItineraryData } from "@/app/api/generate-itinerary/route";
import { useEffect, useState } from "react";

export function useSavedItineraries() {
  const [itineraries, setItineraries] = useState<ItineraryData[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("itineraries");
    const parsed = raw ? JSON.parse(raw) : [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItineraries(parsed);
  }, []);

  useEffect(() => {
    if (!itineraries.length) return;
    localStorage.setItem("itineraries", JSON.stringify(itineraries));
  }, [itineraries]);

  const saveItinerary = (item: ItineraryData) => {
    const newItems = [item, ...itineraries];
    setItineraries(newItems);
  };

  const removeItinerary = (id: string) => {
    const filteredItems = itineraries.filter(
      (itinerary) => itinerary.id !== id
    );
    setItineraries(filteredItems);
  };

  const loadItinerary = (id: string): ItineraryData | undefined => {
    return itineraries.find((itinerary) => itinerary.id === id);
  };

  return {
    itineraries,
    saveItinerary,
    removeItinerary,
    loadItinerary,
  };
}

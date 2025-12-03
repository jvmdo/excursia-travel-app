import { useEffect, useState, useCallback } from "react";

export interface Itinerary {
  id: string;
  destination: string;
  days: number;
  html: string;
  date: string;
}

export function useSavedItineraries() {
  const [saved, setSaved] = useState<Itinerary[]>([]);

  // Load from localStorage only on client
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("itineraries");
    if (raw) {
      try {
        setSaved(JSON.parse(raw));
      } catch {
        setSaved([]);
      }
    }
  }, []);

  // Writes to localStorage
  const persist = useCallback((items: Itinerary[]) => {
    setSaved(items);
    if (typeof window !== "undefined") {
      localStorage.setItem("itineraries", JSON.stringify(items));
    }
  }, []);

  const add = useCallback(
    (item: Itinerary) => {
      const updated = [item, ...saved].slice(0, 10);
      persist(updated);
    },
    [saved, persist]
  );

  const remove = useCallback(
    (id: string) => {
      const updated = saved.filter((itinerary) => itinerary.id !== id);
      persist(updated);
    },
    [saved, persist]
  );

  const load = useCallback(
    (id: string): Itinerary | undefined => {
      return saved.find((itinerary) => itinerary.id === id);
    },
    [saved]
  );

  return {
    saved,
    add,
    remove,
    load,
  };
}

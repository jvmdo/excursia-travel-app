import { useEffect, useState, useCallback } from "react";

export interface SavedItinerary {
  destination: string;
  days: number;
  html: string;
  date: string;
}

export function useSavedItineraries() {
  const [saved, setSaved] = useState<SavedItinerary[]>([]);

  // Load from localStorage only on client
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("roteiros");
    if (raw) {
      try {
        setSaved(JSON.parse(raw));
      } catch {
        setSaved([]);
      }
    }
  }, []);

  // Writes to localStorage
  const persist = useCallback((items: SavedItinerary[]) => {
    setSaved(items);
    if (typeof window !== "undefined") {
      localStorage.setItem("roteiros", JSON.stringify(items));
    }
  }, []);

  const add = useCallback(
    (item: SavedItinerary) => {
      const updated = [item, ...saved].slice(0, 10);
      persist(updated);
    },
    [saved, persist]
  );

  const remove = useCallback(
    (index: number) => {
      const updated = saved.filter((_, i) => i !== index);
      persist(updated);
    },
    [saved, persist]
  );

  const load = useCallback(
    (index: number): SavedItinerary | null => {
      if (!saved[index]) return null;
      return saved[index];
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

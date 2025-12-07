import { ItineraryData } from "@/app/api/generate-itinerary/route";

type SessionRecord = {
  createdAt: number;
  payload: ItineraryData;
};

const PDF_SESSION_TTL_MS = 1000 * 60 * 60; // 60 minutes

declare global {
  var __PDF_SESSION_STORE__:
    | {
        store: Map<string, SessionRecord>;
        cleanupHandle?: NodeJS.Timeout;
      }
    | undefined;
}

if (!globalThis.__PDF_SESSION_STORE__) {
  globalThis.__PDF_SESSION_STORE__ = { store: new Map() };
}

const store = globalThis.__PDF_SESSION_STORE__.store;

export function saveSession(id: string, payload: ItineraryData) {
  store.set(id, { payload, createdAt: Date.now() });
}

export function getPdfSession(id: string): ItineraryData | null {
  const rec = store.get(id);

  if (!rec) return null;

  if (Date.now() - rec.createdAt > PDF_SESSION_TTL_MS) {
    store.delete(id);
    return null;
  }

  return rec.payload;
}

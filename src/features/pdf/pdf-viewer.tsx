"use client";

import { ItineraryData } from "@/app/api/generate-itinerary/route";
import dynamic from "next/dynamic";

const LazyItineraryPdfDocument = dynamic(
  () => import("./itinerary-pdf-document"),
  { ssr: false, loading: () => <p>Gerando PDF...</p> }
);

export default function PdfViewer({ itinerary }: { itinerary: ItineraryData }) {
  return (
    <div className="w-full h-screen bg-white">
      <LazyItineraryPdfDocument itinerary={itinerary} />
    </div>
  );
}

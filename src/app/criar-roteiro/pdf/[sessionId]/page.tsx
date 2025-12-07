import Link from "next/link";
import { getPdfSession } from "@/lib/pdf-session-store";
import PdfViewer from "@/features/pdf/pdf-viewer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roteiro PDF | TravelApp",
};

type PdfParams = Promise<{ sessionId: string }>;

export default async function PdfPage({ params }: { params: PdfParams }) {
  const { sessionId } = await params;
  const itinerary = getPdfSession(sessionId);

  if (!itinerary) {
    return (
      <div>
        PDF not found. Retornar para{" "}
        <Link href="/criar-roteiro">criação de roteiros</Link>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-white">
      <PdfViewer itinerary={itinerary} />
    </div>
  );
}

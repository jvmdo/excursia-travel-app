"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownRenderer } from "@/features/itinerary/components/markdown-renderer";
import { ItineraryData } from "@/app/api/generate-itinerary/route";
import ThankYouDialog from "@/features/itinerary/components/thank-you-dialog";
import { ChecklistDialog } from "@/components/checklist-dialog";

interface ItineraryCardDisplayProps {
  itinerary: ItineraryData;
  onGeneratePDF: () => void;
}

export function ItineraryCardDisplay({
  itinerary,
  onGeneratePDF,
}: ItineraryCardDisplayProps) {
  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="animate-pulse">✨</span> Seu Roteiro
          </CardTitle>
          <div className="flex gap-4 justify-self-center">
            <ChecklistDialog docs={itinerary.neededDocuments} />
            <ThankYouDialog>
              <button
                className="transition-all hover:scale-105 cursor-pointer w-28"
                onClick={onGeneratePDF}
              >
                <div className="p-0.5 bg-linear-to-r from-sky-400 to-purple-400 rounded-lg">
                  <div className="p-0.5 rounded-md bg-white">
                    <span className="text-slate-800 text-sm font-medium">
                      📄 Baixar PDF
                    </span>
                  </div>
                </div>
              </button>
            </ThankYouDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="py-2">
            <div className="itinerary-header mb-4">
              <h2 className="destination-title text-2xl font-bold">
                📍 {itinerary.destination}
              </h2>
              <p className="itinerary-meta text-sm text-muted-foreground">
                {itinerary.numberOfDays} dias • Gerado em{" "}
                {itinerary.createdAt &&
                  new Date(itinerary.createdAt * 1000).toLocaleDateString(
                    "pt-BR"
                  )}{" "}
                • Valores em R$
              </p>
            </div>
            <div className="relative pl-6 mt-6">
              {/* Vertical timeline */}
              <div className="absolute left-0 -top-8 -bottom-4 w-1 bg-linear-to-b from-sky-500 via-cyan-400 to-purple-400 rounded-full" />

              <div className="space-y-10">
                {itinerary.dayItineraries.map((day) => (
                  <div key={day.day} className="relative">
                    <div className="absolute -left-9 top-3 w-7 h-7 rounded-full bg-linear-to-r from-sky-500 to-cyan-400 shadow-md flex items-center justify-center text-sm font-bold text-white">
                      {day.day}
                    </div>

                    <div className="p-2 outline outline-purple-200 rounded-xl shadow-sm hover:shadow-md hover:outline-2 transition-all duration-300 bg-linear-to-br from-sky-50/70 to-white">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="px-2 pt-2 text-lg font-semibold text-slate-900">
                          {day.title}
                        </h3>
                      </div>
                      {day.activities.map((activity) => (
                        <MarkdownRenderer markdown={`- ${activity}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

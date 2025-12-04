"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChecklistDialog } from "../../../components/checklist-dialog";
import { MarkdownRenderer } from "@/features/itinerary/components/markdown-renderer";
import { ItineraryData } from "@/app/api/generate-itinerary/route";

interface ItineraryCardDisplayProps {
  itinerary: ItineraryData;
  onGeneratePDF: () => void;
}

export function ItineraryCardDisplay({
  itinerary,
  onGeneratePDF,
}: ItineraryCardDisplayProps) {
  const [showThankYou, setShowThankYou] = useState(false);
  const [showChecklistPrompt, setShowChecklistPrompt] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [hasShownDialogs, setHasShownDialogs] = useState(false);

  const handleCardClick = () => {
    if (!hasShownDialogs) {
      setShowThankYou(true);
      setHasShownDialogs(true);
    }
  };

  const handleThankYouClose = () => {
    setShowThankYou(false);
    setTimeout(() => {
      setShowChecklistPrompt(true);
    }, 300);
  };

  const handleChecklistResponse = (wantsChecklist: boolean) => {
    setShowChecklistPrompt(false);
    if (wantsChecklist) {
      setTimeout(() => {
        setShowChecklist(true);
      }, 300);
    }
  };

  return (
    <>
      <Card className="mb-6" onClick={handleCardClick}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="animate-pulse">✨</span> Seu Roteiro
          </CardTitle>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onGeneratePDF();
            }}
            size="sm"
            variant="outline"
            className="transition-all hover:scale-105 cursor-pointer"
          >
            📄 Baixar PDF
          </Button>
        </CardHeader>
        <CardContent>
          <div className="py-2">
            <div className="itinerary-header mb-4">
              <h2 className="destination-title text-2xl font-bold">
                📍 {itinerary.destination}
              </h2>
              <p className="itinerary-meta text-sm text-muted-foreground">
                {itinerary.days} dias • Gerado em{" "}
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
                {itinerary.daysList.map((day) => (
                  <div key={day.day} className="relative">
                    <div className="absolute -left-9 top-3 w-7 h-7 rounded-full bg-linear-to-r from-sky-500 to-cyan-400 shadow-md flex items-center justify-center text-sm font-bold text-white">
                      {day.day}
                    </div>

                    <div className="p-2 outline outline-purple-200 rounded-xl shadow-sm hover:shadow-md hover:outline-2 transition-all duration-300 bg-linear-to-br from-sky-50/70 toblue--50/50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="px-2 pt-2 text-lg font-semibold text-slate-900">
                          {day.title}
                        </h3>
                      </div>
                      <MarkdownRenderer markdown={day.description} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thank You Dialog */}
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl flex flex-col items-center gap-3">
              <span className="text-5xl animate-bounce">🎉</span>
              Obrigado por usar nosso app!
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Esperamos que seu roteiro seja incrível e sua viagem inesquecível!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={handleThankYouClose}
              className="bg-linear-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 transition-all hover:scale-105"
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Checklist Prompt Dialog */}
      <Dialog open={showChecklistPrompt} onOpenChange={setShowChecklistPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl flex flex-col items-center gap-3">
              <span className="text-4xl">📋</span>
              Gerar checklist de documentos?
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              Podemos criar uma lista personalizada de documentos necessários
              para sua viagem para <strong>{itinerary.destination}</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => handleChecklistResponse(false)}
              className="transition-all hover:scale-105"
            >
              Não
            </Button>
            <Button
              onClick={() => handleChecklistResponse(true)}
              className="bg-linear-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 transition-all hover:scale-105"
            >
              Sim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Checklist Dialog */}
      <ChecklistDialog
        open={showChecklist}
        onOpenChange={setShowChecklist}
        destino={itinerary.destination}
      />
    </>
  );
}

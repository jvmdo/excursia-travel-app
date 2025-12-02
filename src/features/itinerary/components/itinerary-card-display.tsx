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

interface ItineraryCardDisplayProps {
  result: string;
  destination: string;
  onGeneratePDF: () => void;
}

export function ItineraryCardDisplay({
  result,
  destination,
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
      <Card
        className="mb-6 shadow-lg cursor-pointer transition-all hover:shadow-xl hover:scale-[1.01] duration-300"
        onClick={handleCardClick}
      >
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
            className="transition-all hover:scale-105"
          >
            📄 Baixar PDF
          </Button>
        </CardHeader>
        <CardContent>
          <div
            className="itinerary-display"
            dangerouslySetInnerHTML={{ __html: result }}
          />
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
              para sua viagem para <strong>{destination}</strong>.
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
        destino={destination}
      />
    </>
  );
}

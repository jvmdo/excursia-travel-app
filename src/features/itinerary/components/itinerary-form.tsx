"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TemplateSelector } from "@/features/itinerary/components/template-selector";

export interface ItineraryFormValues {
  destination: string;
  days: number;
  preferences: string;
}

export function ItineraryForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (values: ItineraryFormValues) => void;
  isLoading: boolean;
}) {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [preferences, setPreferences] = useState("");

  const handleAppendTemplate = (text: string) => {
    setPreferences((prev) =>
      prev.trim().length === 0 ? text : prev + "\n" + text
    );
  };

  const handleSubmit = () => {
    const parsed = Number(days);
    if (!destination || !parsed) return;
    onSubmit({ destination, days: parsed, preferences });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow">
      <h2 className="text-lg flex items-center gap-2 font-bold">
        <span>🎯</span> Detalhes do Roteiro
      </h2>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ls">
          ✈️
        </span>
        <Input
          placeholder="Destino (ex.: Porto de galinhas em Ipojuca, Pernambuco)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="pl-10 text-sm"
        />
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
          📅
        </span>
        <Input
          type="number"
          placeholder="Quantos dias de viagem?"
          min={1}
          max={30}
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="pl-10 text-sm"
        />
      </div>

      <div className="relative mb-1">
        <span className="absolute left-3 top-3 text-lg">🧭</span>

        <Textarea
          placeholder="Escreva suas preferências ou selecione dentre as pré-definidas abaixo"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          maxLength={100}
          className="pl-10 min-h-24 text-sm"
        />

        <div className="text-xs text-muted-foreground text-right mt-1">
          {preferences.length}/100
        </div>
      </div>

      <TemplateSelector onSelect={handleAppendTemplate} />

      <Button
        disabled={isLoading}
        onClick={handleSubmit}
        className="cursor-pointer w-full bg-linear-to-r from-sky-500 to-cyan-400 text-white py-6"
      >
        {isLoading ? "⏳ Gerando roteiro..." : "✨ Gerar Roteiro Completo"}
      </Button>
    </div>
  );
}

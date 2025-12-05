"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface ChecklistDialogProps {
  docs?: Record<string, string>[];
}

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  emoji: string;
}

export function ChecklistDialog({ docs }: ChecklistDialogProps) {
  const [items, setItems] = useState<ChecklistItem[]>(() =>
    generateChecklist(docs)
  );

  const toggleItem = (id: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-linear-to-r from-cyan-400 to-purple-400 transition-all hover:scale-105 cursor-pointer"
        >
          Documentos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
            <span className="text-2xl">✅</span>
            Checklist de Documentos
          </DialogTitle>
          <DialogDescription className="text-center">
            Criamos uma lista personalizada de documentos necessários para sua
            viagem
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-96 pr-4">
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => toggleItem(item.id)}
              >
                <Checkbox
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="transition-all"
                />
                <label
                  htmlFor={item.id}
                  className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                >
                  <span>{item.emoji}</span>
                  <span
                    className={item.checked ? "line-through opacity-50" : ""}
                  >
                    {item.label}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function generateChecklist(docs?: Record<string, string>[]): ChecklistItem[] {
  const baseItems: ChecklistItem[] = [
    {
      id: "passport",
      label: "Passaporte válido (mínimo 6 meses)",
      checked: false,
      emoji: "🛂",
    },
    {
      id: "id",
      label: "Documento de identidade (RG ou CNH)",
      checked: false,
      emoji: "🪪",
    },
    {
      id: "tickets",
      label: "Passagens aéreas (impressas e digitais)",
      checked: false,
      emoji: "✈️",
    },
    {
      id: "hotel",
      label: "Voucher de hotel/hospedagem",
      checked: false,
      emoji: "🏨",
    },
    { id: "insurance", label: "Seguro viagem", checked: false, emoji: "🏥" },
    {
      id: "credit",
      label: "Cartões de crédito/débito internacional",
      checked: false,
      emoji: "💳",
    },
    {
      id: "cash",
      label: "Dinheiro em espécie (moeda local)",
      checked: false,
      emoji: "💵",
    },
    {
      id: "phone",
      label: "Celular desbloqueado para chip internacional",
      checked: false,
      emoji: "📱",
    },
    {
      id: "charger",
      label: "Carregadores e adaptadores de tomada",
      checked: false,
      emoji: "🔌",
    },
    {
      id: "meds",
      label: "Medicamentos de uso contínuo (com receita)",
      checked: false,
      emoji: "💊",
    },
  ];

  docs?.forEach((doc) => {
    baseItems.push({
      id: crypto.randomUUID(),
      label: doc.label,
      emoji: doc.emoji,
      checked: false,
    });
  });

  return baseItems;
}

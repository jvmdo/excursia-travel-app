"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChecklistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  destino: string
}

interface ChecklistItem {
  id: string
  label: string
  checked: boolean
  emoji: string
}

export function ChecklistDialog({ open, onOpenChange, destino }: ChecklistDialogProps) {
  const [items, setItems] = useState<ChecklistItem[]>([])

  useEffect(() => {
    if (open) {
      setItems(generateChecklist(destino))
    }
  }, [open, destino])

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
            <span className="text-2xl">✅</span>
            Checklist de Documentos
          </DialogTitle>
          <DialogDescription className="text-center">
            Documentos necessários para sua viagem para <strong>{destino}</strong>
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
                  <span className={item.checked ? "line-through opacity-50" : ""}>{item.label}</span>
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function generateChecklist(destino: string): ChecklistItem[] {
  const baseItems: ChecklistItem[] = [
    { id: "passport", label: "Passaporte válido (mínimo 6 meses)", checked: false, emoji: "🛂" },
    { id: "id", label: "Documento de identidade (RG ou CNH)", checked: false, emoji: "🪪" },
    { id: "tickets", label: "Passagens aéreas (impressas e digitais)", checked: false, emoji: "✈️" },
    { id: "hotel", label: "Voucher de hotel/hospedagem", checked: false, emoji: "🏨" },
    { id: "insurance", label: "Seguro viagem", checked: false, emoji: "🏥" },
    { id: "credit", label: "Cartões de crédito/débito internacional", checked: false, emoji: "💳" },
    { id: "cash", label: "Dinheiro em espécie (moeda local)", checked: false, emoji: "💵" },
    { id: "phone", label: "Celular desbloqueado para chip internacional", checked: false, emoji: "📱" },
    { id: "charger", label: "Carregadores e adaptadores de tomada", checked: false, emoji: "🔌" },
    { id: "meds", label: "Medicamentos de uso contínuo (com receita)", checked: false, emoji: "💊" },
  ]

  const destinoLower = destino.toLowerCase()

  // Europa
  if (
    destinoLower.includes("europa") ||
    destinoLower.includes("frança") ||
    destinoLower.includes("italia") ||
    destinoLower.includes("espanha") ||
    destinoLower.includes("portugal") ||
    destinoLower.includes("alemanha") ||
    destinoLower.includes("inglaterra") ||
    destinoLower.includes("reino unido")
  ) {
    baseItems.push(
      { id: "schengen", label: "Visto Schengen (se aplicável)", checked: false, emoji: "📝" },
      { id: "travel-auth", label: "Autorização de viagem ETIAS (a partir de 2025)", checked: false, emoji: "🌍" },
    )
  }

  // Estados Unidos
  if (destinoLower.includes("eua") || destinoLower.includes("estados unidos") || destinoLower.includes("america")) {
    baseItems.push(
      { id: "visa", label: "Visto americano válido", checked: false, emoji: "🗽" },
      { id: "esta", label: "ESTA (se elegível para programa de isenção)", checked: false, emoji: "📋" },
    )
  }

  // Países que exigem vacinas
  if (
    destinoLower.includes("brasil") ||
    destinoLower.includes("africa") ||
    destinoLower.includes("asia") ||
    destinoLower.includes("tailandia") ||
    destinoLower.includes("india")
  ) {
    baseItems.push({
      id: "vaccine",
      label: "Certificado internacional de vacinação (febre amarela)",
      checked: false,
      emoji: "💉",
    })
  }

  // Destinos que requerem visto
  if (
    destinoLower.includes("australia") ||
    destinoLower.includes("china") ||
    destinoLower.includes("russia") ||
    destinoLower.includes("india")
  ) {
    baseItems.push({ id: "visa-req", label: "Visto de turista", checked: false, emoji: "📄" })
  }

  // América do Sul (Mercosul)
  if (
    destinoLower.includes("argentina") ||
    destinoLower.includes("uruguai") ||
    destinoLower.includes("paraguai") ||
    destinoLower.includes("chile")
  ) {
    baseItems.push({ id: "rg", label: "RG (aceito em países do Mercosul)", checked: false, emoji: "🆔" })
  }

  return baseItems
}

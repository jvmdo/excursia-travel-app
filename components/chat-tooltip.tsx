"use client"

import type React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatTooltipProps {
  children: React.ReactNode
}

export function ChatTooltip({ children }: ChatTooltipProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="left"
          className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white border-0 animate-in fade-in zoom-in"
        >
          <p className="font-medium">💬 Precisa de ajuda? Fale comigo!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

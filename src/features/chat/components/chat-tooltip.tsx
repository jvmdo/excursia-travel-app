"use client";

import type React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatTooltipProps {
  children: React.ReactNode;
}

export function ChatTooltip({ children }: ChatTooltipProps) {
  return (
    <Tooltip
      delayDuration={500}
      disableHoverableContent={true}
      defaultOpen={true}
    >
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="left"
        className="bg-linear-to-r from-sky-500 to-cyan-400 text-white border-0 animate-in fade-in zoom-in z-0"
      >
        <p className="font-medium">💬 Precisa de ajuda? Fale comigo!</p>
      </TooltipContent>
    </Tooltip>
  );
}

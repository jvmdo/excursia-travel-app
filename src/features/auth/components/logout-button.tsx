"use client";

import { Button } from "@/components/ui/button";

export function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all hover:scale-105"
      title="Sair"
    >
      👋 Sair
    </Button>
  );
}

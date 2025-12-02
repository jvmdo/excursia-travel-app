"use client";

import { Button } from "@/components/ui/button";

export function ChatFabButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-xl bg-linear-to-r from-sky-500 to-cyan-400 hover:scale-110 text-white text-2xl"
    >
      💬
    </Button>
  );
}

"use client";

import { Button } from "@/components/ui/button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

export function ChatInput({
  value,
  disabled,
  onChange,
  onSend,
}: ChatInputProps) {
  return (
    <div className="border-t p-3 gap-2 flex">
      <input
        type="text"
        placeholder="💭 Digite sua pergunta"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        className="flex-1 px-3 py-2 border border-border rounded-full text-sm"
      />
      <Button
        onClick={onSend}
        disabled={disabled}
        className="rounded-full px-3 bg-sky-500 hover:bg-purple-400 transition-colors duration-300"
      >
        ➤
      </Button>
    </div>
  );
}

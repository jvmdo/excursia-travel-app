"use client";

import { Button } from "@/components/ui/button";

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}) {
  return (
    <div className="border-t p-3 gap-2 flex">
      <input
        type="text"
        placeholder="💭 Digite sua pergunta..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        className="flex-1 px-3 py-2 border border-border rounded-full text-sm"
      />
      <Button
        onClick={onSend}
        disabled={disabled}
        className="rounded-full px-3"
      >
        ➤
      </Button>
    </div>
  );
}

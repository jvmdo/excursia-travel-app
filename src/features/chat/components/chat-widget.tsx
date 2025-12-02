"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChatFabButton } from "@/features/chat/components/chat-fab-button";
import { ChatMessageList } from "@/features/chat/components/chat-message-list";
import { ChatInput } from "@/features/chat/components/chat-input";

export function ChatWidget({
  open,
  onOpenChange,
  messages,
  isLoading,
  input,
  onInputChange,
  onSend,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: { role: "user" | "assistant"; content: string }[];
  isLoading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <ChatFabButton onClick={() => onOpenChange(!open)} />
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0 shadow-xl" align="end">
        <div className="bg-linear-to-r from-sky-500 to-cyan-400 text-white p-4 rounded-t-lg">
          <h3 className="font-semibold flex items-center gap-2">
            🤖 Assistente de Viagens
          </h3>
          <p className="text-xs opacity-90">
            Tire dúvidas sobre destinos e viagens
          </p>
        </div>

        <ChatMessageList messages={messages} isLoading={isLoading} />

        <ChatInput
          value={input}
          onChange={onInputChange}
          onSend={onSend}
          disabled={isLoading || !input.trim()}
        />
      </PopoverContent>
    </Popover>
  );
}

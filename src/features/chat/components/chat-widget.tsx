"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChatMessageList } from "@/features/chat/components/chat-message-list";
import { ChatInput } from "@/features/chat/components/chat-input";
import { ChatMessage } from "@/features/chat/api/send-chat-message";
import { ChatTooltip } from "@/features/chat/components/chat-tooltip";

interface ChatWidgetProps {
  input: string;
  isLoading: boolean;
  messages: ChatMessage[];
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export function ChatWidget({
  messages,
  isLoading,
  input,
  onInputChange,
  onSend,
}: ChatWidgetProps) {
  return (
    <Popover>
      <ChatTooltip>
        <PopoverTrigger className="fixed z-10 bottom-6 right-6 w-16 h-16 rounded-full shadow-xl bg-linear-to-r from-sky-500 to-cyan-400 hover:scale-110 text-white text-2xl">
          💬
        </PopoverTrigger>
      </ChatTooltip>

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

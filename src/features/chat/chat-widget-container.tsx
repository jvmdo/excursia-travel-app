"use client";

import { useState } from "react";
import { useChat } from "@/features/chat/hooks/use-chat";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChatTooltip } from "@/features/chat/components/chat-tooltip";
import { ChatMessageList } from "@/features/chat/components/chat-message-list";
import { ChatInput } from "@/features/chat/components/chat-input";

export default function ChatWidgetContainer() {
  const { data, isLoading, error, sendMessage, retryLastMessage } = useChat();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <Popover>
      <ChatTooltip>
        <PopoverTrigger className="fixed z-10 bottom-2 right-2 sm:bottom-6 sm:right-6 w-16 h-16 rounded-full shadow-xl bg-linear-to-r from-sky-500 to-cyan-400 transition-transform hover:scale-110 text-white text-2xl">
          💬
        </PopoverTrigger>
      </ChatTooltip>

      <PopoverContent
        className="p-0 shadow-xl"
        style={{
          width: "min(96vw, 384px)",
        }}
        align="end"
      >
        <div className="bg-linear-to-r from-sky-500 to-cyan-400 text-white p-4 rounded-t-lg">
          <h3 className="font-semibold flex items-center gap-2">
            🤖 Assistente de Viagens
          </h3>
          <p className="text-xs opacity-90">
            Tire dúvidas sobre seu roteiro, destinos e documentos
          </p>
        </div>

        <ChatMessageList
          messages={data}
          isLoading={isLoading}
          error={error}
          onRetry={retryLastMessage}
        />

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isLoading || !input.trim()}
        />
      </PopoverContent>
    </Popover>
  );
}

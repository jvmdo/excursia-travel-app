"use client";

import { useState, useCallback } from "react";
import {
  sendChatMessage,
  ChatMessage,
} from "@/features/chat/api/send-chat-message";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMessage: ChatMessage = {
        role: "user",
        content: trimmed,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await sendChatMessage({
          message: trimmed,
          history: [...messages, userMessage],
        });

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.mensagem },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "❌ Erro: não consegui responder. Tente novamente.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return {
    messages,
    isLoading,
    send,
  };
}

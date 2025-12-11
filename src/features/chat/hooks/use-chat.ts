"use client";

import { ChatMessageData } from "@/app/api/chat-travel/route";
import { sendChatMessage } from "@/features/chat/api/send-chat-message";
import { useState } from "react";

export function useChat() {
  const [data, setData] = useState<ChatMessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      message: {
        role: "user",
        content,
      },
    };

    setData((currentData) => [...currentData, userMessage]);
    await send(content);
  };

  const retryLastMessage = async () => {
    const content = data.at(-1)?.message.content;
    if (!content) return;
    send(content);
  };

  const send = async (content: string) => {
    setIsLoading(true);
    setError("");

    try {
      const assistantResponse = await sendChatMessage({
        content,
        history: data.map(({ message }) => message),
      });

      setData((currentData) => [...currentData, assistantResponse]);
    } catch (err) {
      setError((err as TypeError).message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    sendMessage,
    retryLastMessage,
  };
}

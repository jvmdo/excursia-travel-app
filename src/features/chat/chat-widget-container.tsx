"use client";

import { useState } from "react";
import { useChat } from "@/features/chat/hooks/use-chat";
import { ChatWidget } from "@/features/chat/components/chat-widget";

export default function ChatWidgetContainer() {
  const { messages, isLoading, send } = useChat();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    send(input);
    setInput("");
  };

  return (
    <ChatWidget
      messages={messages}
      isLoading={isLoading}
      input={input}
      onInputChange={setInput}
      onSend={handleSend}
    />
  );
}

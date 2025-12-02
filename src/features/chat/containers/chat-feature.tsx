"use client";

import { useState } from "react";
import { useChat } from "@/features/chat/hooks/use-chat";
import { ChatWidget } from "@/features/chat/components/chat-widget";

export function ChatFeature() {
  const { messages, isLoading, send } = useChat();
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    send(msg);
  };

  return (
    <ChatWidget
      open={open}
      onOpenChange={setOpen}
      messages={messages}
      isLoading={isLoading}
      input={input}
      onInputChange={setInput}
      onSend={handleSend}
    />
  );
}

"use client";

import { ChatMessage } from "@/features/chat/api/send-chat-message";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
          isUser ? "bg-sky-500 text-white" : "bg-border text-foreground"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

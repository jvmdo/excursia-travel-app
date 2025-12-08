"use client";

import { ChatMessage } from "@/app/api/chat-travel/route";
import { ComponentPropsWithRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatBubbleProps extends ComponentPropsWithRef<"div"> {
  message: ChatMessage;
}

export function ChatBubble({ ref, message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      ref={ref}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-sm mb-2 ${
          isUser ? "bg-sky-500 text-white" : "bg-border text-foreground"
        }`}
      >
        <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
      </div>
    </div>
  );
}

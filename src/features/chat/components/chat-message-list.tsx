"use client";

import { ChatBubble } from "@/features/chat/components/chat-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessageData } from "@/app/api/chat-travel/route";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

interface ChatMessageListProps {
  messages: ChatMessageData[];
  isLoading: boolean;
  error: string;
  onRetry: () => void;
}

export function ChatMessageList({
  messages,
  isLoading,
  error,
  onRetry,
}: ChatMessageListProps) {
  const bubbleRef = useRef<HTMLDivElement | null>(null);

  const lastMessage = messages.at(-1);
  const lastMessageId = lastMessage?.id ?? "";

  useEffect(() => {
    const scrollToBottom = () => {
      setTimeout(() => {
        bubbleRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 0);
    };

    scrollToBottom();
  }, [lastMessageId]);

  return (
    <ScrollArea
      className="h-80 px-4 py-2 flex flex-col gap-3 overflow-y-auto"
      ref={bubbleRef}
    >
      {messages.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-4">
          👋 Olá! Como posso ajudar com suas viagens?
        </div>
      )}

      {messages.map(({ id, message }, index) => {
        const isLast = index === messages.length - 1;

        return (
          <ChatBubble
            key={id}
            message={message}
            ref={isLast && !isLoading ? bubbleRef : undefined}
          />
        );
      })}

      {isLoading && (
        <div ref={bubbleRef} className="text-muted-foreground text-smj py-2">
          Digitando...
        </div>
      )}

      {Boolean(error) && (
        <div className={"flex justify-center items-center gap-1"}>
          <div className="max-w-xs px-4 py-2 rounded-lg text-sm bg-border text-red-500">
            ⚠️ {error}
          </div>
          <Button
            variant="ghost"
            className="text-2xl aspect-square"
            onClick={onRetry}
          >
            🔄️
          </Button>
        </div>
      )}
    </ScrollArea>
  );
}

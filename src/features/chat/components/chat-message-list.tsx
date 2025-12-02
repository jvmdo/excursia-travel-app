"use client";

import { ChatMessage } from "@/features/chat/api/send-chat-message";
import { ChatBubble } from "@/features/chat/components/chat-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatMessageList({
  messages,
  isLoading,
}: {
  messages: ChatMessage[];
  isLoading: boolean;
}) {
  return (
    <ScrollArea className="h-80 p-4 flex flex-col gap-3">
      {messages.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-8">
          👋 Olá! Como posso ajudar com suas viagens?
        </div>
      )}

      {messages.map((msg, i) => (
        <ChatBubble key={i} message={msg} />
      ))}

      {isLoading && (
        <div className="text-muted-foreground text-sm">Digitando...</div>
      )}
    </ScrollArea>
  );
}

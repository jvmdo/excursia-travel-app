import { ChatMessageData, SendChatMessage } from "@/app/api/chat-travel/route";

export async function sendChatMessage(
  params: SendChatMessage
): Promise<ChatMessageData> {
  const response = await fetch("/api/chat-travel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error(
      json?.error ||
        "Assistente muito ocupado no momento. Por favor, tente novamente mais tarde."
    );
  }

  const json = await response.json();

  return json;
}

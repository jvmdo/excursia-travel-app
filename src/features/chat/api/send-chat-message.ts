export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SendChatMessageParams {
  message: string;
  history: ChatMessage[];
}

export interface SendChatMessageResponse {
  mensagem: string;
}

export async function sendChatMessage(
  params: SendChatMessageParams
): Promise<SendChatMessageResponse> {
  const response = await fetch("/api/chat-travel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    let message = "Erro no chat";
    try {
      const json = await response.json();
      message = json.erro ?? message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

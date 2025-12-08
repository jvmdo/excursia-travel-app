import { type NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import dedent from "dedent";
import z from "zod";
import pRetry from "p-retry";
import { Groq } from "groq-sdk";

const ChatMessageSchema = z.object({
  role: z.literal(["assistant", "user"]),
  content: z.string(),
});

const SendChatMessageSchema = z.object({
  content: z.string(),
  history: z.array(ChatMessageSchema),
});

const ChatMessageDataSchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  message: ChatMessageSchema,
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type SendChatMessage = z.infer<typeof SendChatMessageSchema>;
export type ChatMessageData = z.infer<typeof ChatMessageDataSchema>;

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const sendMessagePayload = SendChatMessageSchema.safeParse(payload);

    if (!sendMessagePayload.success) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const {
      data: { content: message, history },
    } = sendMessagePayload;

    const response = await pRetry(
      async () => await getGroqChatCompletion(message, history),
      {
        retries: 3,
        factor: 5,
        shouldRetry({ error }) {
          if (error instanceof Groq.APIError) {
            const code = error.status as number;
            return shouldRetryStatus[code] ?? false;
          }
          return false;
        },
      }
    );

    const chatMessageData: ChatMessageData = {
      id: crypto.randomUUID(),
      createdAt: response.created,
      message: {
        role: response.choices[0].message.role,
        content: response.choices[0].message.content ?? "",
      },
    };

    const parsed = ChatMessageDataSchema.safeParse(chatMessageData);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Falha ao responder. Por favor, tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao responder. Por favor, tente novamente." },
      { status: 500 }
    );
  }
}

async function getGroqChatCompletion(prompt: string, history: ChatMessage[]) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: dedent`
          Você é um especialista em turismo brasileiro e internacional capaz de responder perguntas sobre destinos, dicas de viagem, custos, documentação, melhor época para viajar, etc. 
          
          Use poucas palavras, sendo direto e conciso.
          Use emojis quando apropriado.
          Seja amigável e inspirador.
          Responda em Português do Brasil.
          Recuse responder, sucinta e educadamente, mensagens cujo conteúdo não tenha relação com viagens e turismo.

          Formatação da resposta: 
            - Markdown
            - Não use tabelas nem colunas
            - Estruture o conteúdo verticalmente, com espaçamento adequado
        `,
      },
      ...history,
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "compound-beta-mini",
    temperature: 0.4,
    max_completion_tokens: 500,
    stream: false,
    response_format: {
      type: "text",
    },
    search_settings: {
      country: "Brazil",
      include_images: false,
    },
  });
}

const shouldRetryStatus: Record<number, boolean> = {
  400: false,
  500: true,
  502: true,
  503: false, // Try again later
};

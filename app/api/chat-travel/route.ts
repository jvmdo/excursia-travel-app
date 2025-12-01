import { type NextRequest, NextResponse } from "next/server"

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!GROQ_API_KEY) {
      return NextResponse.json({ erro: "API key não configurada" }, { status: 500 })
    }

    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente especializado em viagens. Responda perguntas sobre destinos, dicas de viagem, custos, documentação, melhor época para viajar, etc. Seja conciso e útil. Use emojis quando apropriado.",
          },
          ...(history as ChatMessage[]),
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error("Erro na API Groq")
    }

    const data = await response.json()
    const mensagem = data.choices?.[0]?.message?.content || "Não consegui processar sua pergunta."

    return NextResponse.json({ mensagem })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ erro: "Erro ao processar mensagem" }, { status: 500 })
  }
}

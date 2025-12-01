import { type NextRequest, NextResponse } from "next/server"

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"

export async function POST(request: NextRequest) {
  try {
    const { destino, dias, moeda, preferencias } = await request.json()

    if (!GROQ_API_KEY) {
      return NextResponse.json({ erro: "API key não configurada" }, { status: 500 })
    }

    const prompt = `Crie um roteiro COMPLETO e MUITO DETALHADO para ${dias} dias em ${destino}.

REGRAS IMPORTANTES:
- Use MUITOS EMOJIS relevantes
- Cada dia deve ter:
  • Horários específicos (ex: 08:00, 12:30, 15:00)
  • Pelo menos 5-7 atividades por dia
  • Explicação de transporte entre pontos
  • Custos aproximados em ${moeda}
  • Dicas práticas
- Estruture com títulos claros: "Dia 1: [Tema]"
- Inclua restaurantes recomendados
- Idioma: Português do Brasil
- Tom: Amigável e inspirador
${preferencias ? `\nPreferências: ${preferencias}` : ""}`

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
            content: `Você é um especialista em turismo. Crie roteiros detalhados usando ${moeda} para valores.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Erro na API Groq")
    }

    const data = await response.json()
    const texto = data.choices?.[0]?.message?.content

    if (!texto) {
      throw new Error("Resposta vazia da IA")
    }

    return NextResponse.json({ texto })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { erro: error instanceof Error ? error.message : "Erro ao gerar roteiro" },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

const ItineraryDaySchema = z.object({
  day: z.number(),
  title: z.string(),
  description: z.string(), // markdown
  tips: z.array(z.string()).optional(),
});

export const ItineraryDataSchema = z.object({
  id: z.string(),
  destination: z.string(),
  days: z.number(),
  daysList: z.array(ItineraryDaySchema),
  createdAt: z.number().optional(),
});

export type ItineraryData = z.infer<typeof ItineraryDataSchema>;

export async function POST(request: NextRequest) {
  try {
    const { destination, days, preferences } = await request.json();

    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { erro: "API key não configurada" },
        { status: 500 }
      );
    }

    if (!destination || !days) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const prompt = `
Crie um roteiro COMPLETO e MUITO DETALHADO para ${days} dias em ${destination}.

REGRAS IMPORTANTES:
- Use MUITOS EMOJIS relevantes
- Cada dia deve ter:
  • Horários específicos (ex: 08:00, 12:30, 15:00)
  • Pelo menos 5-7 atividades por dia
  • Explicação de transporte entre pontos
  • Restaurantes e lugares para se alimentar
  • Custos aproximados em real brasileiro, inclua o preço em dólar americano entre parênteses somente se o destino for fora do Brasil.
  • Dicas práticas
- Idioma: Português do Brasil
- Tom: Amigável e inspirador
${preferences ? `\n- Preferências do turista: ${preferences}` : ""}
- Estruture sua resposta em JSON seguindo o formato: 
{
  "destination": string,
  "days": number,
  "daysList": [
    {
      "day": 1,
      "title": "Título",
      "description": "Texto descrevendo o itinerário desse dia. Inicie cada atividade com as horas entre colchetes. Não inclua tips nesse texto.",
      "tips": ["tip1", "tip2"]
    },
    ...
  ]
}
- Na "description" de cada dia, destaques devem ser palavras em negrito. Avisos importantes devem ser palavras em itálico.
- "destination" deve incluir ambos estado (abreviado em sigla) e país se ${destination} não os inclui.


Return valid JSON only. Do not include any commentary or code fences.
`;

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
            content: `Você é um especialista em turismo. Crie roteiros detalhados usando real brasileiro para valores.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Erro na API Groq");
    }

    const groqData = await response.json();
    console.log(groqData.choices?.[0]?.message?.content);
    const groqChoices = JSON.parse(groqData.choices?.[0]?.message?.content);
    const itineraryData: ItineraryData = {
      id: groqData.id,
      createdAt: groqData.created,
      ...groqChoices,
    };
    const parsed = ItineraryDataSchema.safeParse(itineraryData);
    console.log(parsed.error?.issues);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Failed to generate itinerary" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        erro: error instanceof Error ? error.message : "Erro ao gerar roteiro",
      },
      { status: 500 }
    );
  }
}

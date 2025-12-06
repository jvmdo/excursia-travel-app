import { groq } from "@/lib/groq";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import dedent from "dedent";
import Groq from "groq-sdk";
import pRetry from "p-retry";

const ItineraryDaySchema = z.object({
  day: z.number(),
  title: z.string(),
  activities: z.array(z.string()),
  tips: z.array(z.string()).optional(),
});

export const ItineraryDataSchema = z.object({
  id: z.string(),
  destination: z.string(),
  numberOfDays: z.number(),
  dayItineraries: z.array(ItineraryDaySchema),
  createdAt: z.number().optional(),
});

export type ItineraryData = z.infer<typeof ItineraryDataSchema>;

export async function POST(request: NextRequest) {
  try {
    const { destination, days, preferences } = await request.json();

    if (!destination || !days) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // prettier-ignore
    const prompt = dedent`Olá! Gosto muito dos seus roteiros de viagem. 
        Estou saindo em viagem por ${days} dia${days > 1 ? "s" : ""} para ${destination}.
        Gostaria que você escrevesse um itinerário bem detalhado para mim por gentileza. 
        Minhas preferências são ${preferences}.`;

    const response = await pRetry(
      async () => await getGroqChatCompletion(prompt),
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
    const content = response.choices[0].message.content ?? "{}";
    console.log(response);
    console.log(content);
    const groqChoices = JSON.parse(content);
    const itineraryData: ItineraryData = {
      id: response.id,
      createdAt: response.created,
      ...groqChoices,
    };
    const parsed = ItineraryDataSchema.safeParse(itineraryData);

    if (!parsed.success) {
      console.log(parsed.error?.issues);
      return NextResponse.json(
        { error: "Falha ao gerar roteiro. Por favor, tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (err) {
    console.error(err);
    let message = "Algo deu errado. Tente novamente mais tarde.";

    if (err instanceof Groq.APIError) {
      message = dedent`
        Falha ao gerar roteiro. Por favor, tente novamente. 
        Se o error persistir, tente alterar suas preferências.`;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function getGroqChatCompletion(prompt: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: dedent`
          Você é um especialista em turismo brasileiro e internacional capaz de escrever roteiros/itinerários de viagem detalhados.

            Regras do conteúdo:
              - Cada dia deve ter:
                  - Horários específicos (ex: 08:00, 12:30, 15:00)
                  - Pelo menos 5-7 atividades por dia
                  - Explicação de transporte entre pontos
                  - Restaurantes e lugares para se alimentar
                  - Custos aproximados em real brasileiro, inclua o preço em dólar americano entre parênteses somente se o destino for fora do Brasil.
                  - Dicas práticas
              - Se o destino não for específico o suficiente, escolha o destino correspondente mais famoso.
              - Destino retornado deve incluir ambos estado (abreviado em sigla) e país se o usuário não os incluiu na requisição.
              - Use emojis relevantes no título e no texto.

            Regras de formatação do itinerário:
              - Comece cada atividade com o horário em colchetes. Por exemplo, "[8:45] Descobrindo a cidade..."
              - Escreva um parágrafo para cada atividade. Cada parágrafo deve ser um item no array "activities" do schema fornecido.
              - Destaque palavras de interesse em negrito. Por exemplo, "**Cristo Redentor**"
              - Destaque palavras de aviso/atenção em itálico. Por exemplo, "_Negocie preços_"
              - O título não deve conter o número do dia. Por exemplo, "Dia 1: Explorando..." não é válido. O correto é "Explorando...".
              - Inclua emojis no título e no conteúdo.
              - Não inclua as dicas no conteúdo, elas são exclusivas do campo "tips" do schema fornecido.
              - Não repita dicas no campo "tips". Se não houver dicas diferentes para cada dia, inclua-as somente no último dia.

            Seja amigável e inspirador.
            Responda em Português do Brasil.

          Output JSON only using the schema provided.
        `,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    temperature: 0.8,
    max_completion_tokens: 2000,
    stream: false,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "detailed_trip_itinerary",
        strict: true,
        schema: z.toJSONSchema(
          ItineraryDataSchema.omit({ id: true, createdAt: true })
        ),
      },
    },
  });
}

const shouldRetryStatus: Record<number, boolean> = {
  400: true,
  500: true,
  502: true,
  503: false, // Try again later
};

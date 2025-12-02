export interface GenerateItineraryParams {
  destino: string;
  dias: number;
  moeda: string;
  estilo: string;
}

export interface GenerateItineraryResponse {
  texto: string;
}

export async function generateItinerary({
  destino,
  dias,
  moeda,
  estilo,
}: GenerateItineraryParams): Promise<GenerateItineraryResponse> {
  const response = await fetch("/api/generate-itinerary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destino, dias, moeda, estilo }),
  });

  if (!response.ok) {
    throw new Error("Erro ao gerar roteiro");
  }

  const json = await response.json();

  if (!json || typeof json.texto !== "string") {
    throw new Error("Resposta inválida ao gerar roteiro");
  }

  return json;
}

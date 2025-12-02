/**
 * Detects the currency based on the destination country.
 * Returns USD as fallback.
 */
export function detectCurrency(destino: string): string {
  const mapping: Record<string, string> = {
    brasil: "BRL",
    "porto rico": "USD",
    argentina: "ARS",
    chile: "CLP",
    colombia: "COP",
    mexico: "MXN",
    peru: "PEN",
    espanha: "EUR",
    italia: "EUR",
    france: "EUR",
    portugal: "EUR",
    "reino unido": "GBP",
    eua: "USD",
    canada: "CAD",
    japao: "JPY",
    tailandia: "THB",
    vietna: "VND",
  };

  const lower = destino.toLowerCase();
  for (const [pais, moeda] of Object.entries(mapping)) {
    if (lower.includes(pais)) return moeda;
  }

  return "USD";
}

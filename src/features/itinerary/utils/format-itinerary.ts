import { markdownToHtml, parseItinerary } from "@/lib/markdown-to-html";

/**
 * Formats the AI-produced itinerary text into a structured HTML timeline.
 */
export function formatItinerary({
  destino,
  dias,
  moeda,
  texto,
}: {
  destino: string;
  dias: number;
  moeda: string;
  texto: string;
}): string {
  if (!texto || typeof texto !== "string") {
    return "";
  }

  const parsed = parseItinerary(texto);

  let html = `
    <div class="itinerary-container">
      <div class="itinerary-header">
        <h2 class="destination-title">📍 ${destino}</h2>
        <p class="itinerary-meta">${dias} dias • Gerado em ${new Date().toLocaleDateString(
    "pt-BR"
  )} • Valores em ${moeda}</p>
      </div>
      <div class="days-grid">
  `;

  parsed.forEach((day, index) => {
    html += `
      <div class="day-card-modern" style="animation-delay: ${index * 0.1}s">
        <div class="card-corner-decoration">✨</div>
        <div class="day-badge">
          <span class="day-emoji">📅</span>
          <span class="day-number">Dia ${day.day}</span>
        </div>
        <div class="day-title-section">
          <h3 class="day-title-enhanced">${markdownToHtml(day.title)}</h3>
        </div>
        <div class="day-content-enhanced">${day.content}</div>
        <div class="card-footer-decoration">
          <span>🌟</span><span>🗺️</span><span>✈️</span>
        </div>
      </div>
    `;
  });

  html += `</div></div>`;

  return html;
}

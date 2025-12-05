import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize from "rehype-sanitize";
import { ItineraryData } from "@/app/api/generate-itinerary/route";

// inline CSS template for PDF output; adjust colors/fonts as needed
const PDF_CSS = `
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; background: #f8fafc; color: #0f172a; }
  .itinerary-container { max-width: 900px; margin: 20px auto; background: white; border-radius: 10px; }
  .destination-title { color: black; font-size: 28px; margin-bottom: 6px; }
  .itinerary-meta { color: #64748b; font-size: 13px; margin-bottom: 40px; }
  h3 { margin: 0 0 8px 0; }
  .day-content-enhanced { font-size: 14px; line-height: 1.7; color: #334155; }
  .day-content-enhanced ul { margin-left: 18px; }
  @media print {
    .day-card-modern { page-break-inside: avoid; }
  }
`;

function renderMarkdownToHtml(markdown: string) {
  try {
    return unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .processSync(markdown)
      .toString();
  } catch (err) {
    return markdown.replace(/\n/g, "<br/>");
  }
}

function parseItinerary(text: string) {
  if (typeof text !== "string") throw new TypeError("text must be a string");

  // Find each block that starts with [HH:MM] up to the next [HH:MM] or end.
  const blocks =
    text.match(/\[\d{2}:\d{2}\][\s\S]*?(?=(\[\d{2}:\d{2}\])|$)/g) || [];

  const cleaned = blocks.map((raw) => {
    let s = raw.trim();

    // Normalize multiple spaces
    s = s.replace(/\s{2,}/g, " ");

    return `- ${s}`;
  });

  return cleaned.join("\n");
}

export function buildPdfHtml(itinerary: ItineraryData) {
  const body = [];
  body.push(`<div class="itinerary-container">`);
  body.push(`<div class="itinerary-header">`);
  body.push(`<h2 class="destination-title">📍 ${itinerary.destination}</h2>`);
  body.push(
    `<p class="itinerary-meta">${itinerary.numberOfDays} dias ${
      itinerary.createdAt &&
      `• Gerado em ${new Date(itinerary.createdAt).toLocaleDateString("pt-BR")}`
    } • Valores em R$</p>`
  );
  body.push(`</div>`);

  itinerary.dayItineraries.forEach((d) => {
    body.push(`<div class="day-card-modern">`);
    body.push(
      `<div class="day-title"><h3>📅 Dia ${d.day} — ${d.title}</h3></div>`
    );
    body.push(
      `<div class="day-content-enhanced">${renderMarkdownToHtml(
        parseItinerary(d.description)
      )}</div>`
    );

    if (d.tips && d.tips.length > 0) {
      body.push(`<div class="mt-3"><h4>Dicas</h4><ul>`);
      d.tips.forEach((t) => body.push(`<li>${t}</li>`));
      body.push(`</ul></div>`);
    }

    body.push(`</div>`);
  });

  body.push(`</div>`);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Itinerário - ${itinerary.destination}</title>
    <style>${PDF_CSS}</style>
  </head>
  <body>${body.join("")}</body>
</html>`;
}

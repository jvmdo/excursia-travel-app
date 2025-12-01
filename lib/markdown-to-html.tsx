/**
 * Parse markdown text to HTML with support for:
 * - Bold text: **text** or __text__
 * - Italic text: *text* or _text_
 * - Lists: - item or * item
 * - Headers: ## text
 */
export function markdownToHtml(text: string): string {
  const html = text
    // Bold: **text** or __text__
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    // Italic: *text* or _text_ (but not in bold)
    .replace(/(?<!\*)\*((?!\*).*?)\*(?!\*)/g, "<em>$1</em>")
    .replace(/(?<!_)_((?!_).*?)_(?!_)/g, "<em>$1</em>")
    // Headers: ## text
    .replace(/^### (.*?)$/gm, "<h4>$1</h4>")
    .replace(/^## (.*?)$/gm, "<h3>$1</h3>")
    .replace(/^# (.*?)$/gm, "<h2>$1</h2>")
    // Line breaks
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")

  return html
}

/**
 * Parse itinerary text into structured day objects
 * Uses the same logic as the original formatarRoteiroComTimeline function
 */
export interface ItineraryDay {
  day: number
  title: string
  content: string
  activities: string[]
}

export function parseItinerary(text: string): ItineraryDay[] {
  const days: ItineraryDay[] = []

  const lines = text.split("\n")
  let currentDay = 0
  let dayTitle = ""
  let dayContent = ""

  lines.forEach((line) => {
    const dayMatch = line.match(/Dia\s+(\d+)/i)

    if (dayMatch) {
      // Save previous day if exists
      if (currentDay > 0 && dayContent) {
        days.push({
          day: currentDay,
          title: dayTitle,
          content: dayContent,
          activities: [],
        })
      }

      currentDay = Number.parseInt(dayMatch[1])
      dayTitle = line.replace(/\*\*/g, "").trim()
      dayContent = ""
    } else if (line.trim()) {
      // Add content to current day
      if (currentDay > 0) {
        const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>")

        dayContent += `<p>${formatted}</p>`
      }
    }
  })

  // Save last day
  if (currentDay > 0 && dayContent) {
    days.push({
      day: currentDay,
      title: dayTitle,
      content: dayContent,
      activities: [],
    })
  }

  return days
}

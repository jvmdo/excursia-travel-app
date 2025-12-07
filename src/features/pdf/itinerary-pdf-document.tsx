"use client";

import { ItineraryData } from "@/app/api/generate-itinerary/route";
import { removeEmojis } from "@/features/itinerary/utils";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  PDFViewer,
} from "@react-pdf/renderer";
import { marked } from "marked";
import { ReactElement } from "react";

export const pdfFont = "Noto Sans";
const regularFont = `${process.env.NEXT_PUBLIC_APP_URL}/fonts/NotoSans-Regular.ttf`;
const boldFont = `${process.env.NEXT_PUBLIC_APP_URL}/fonts/NotoSans-Bold.ttf`;
const italicFont = `${process.env.NEXT_PUBLIC_APP_URL}/fonts/NotoSans-Italic.ttf`;

Font.register({
  family: pdfFont,
  fonts: [
    { src: regularFont, fontWeight: "normal" },
    { src: boldFont, fontWeight: "bold" },
    { src: italicFont, fontStyle: "italic" },
  ],
});

const styles = StyleSheet.create({
  page: {
    color: "black",
    fontFamily: pdfFont,
    padding: 48,
    fontSize: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  meta: {
    color: "gray",
    fontSize: 10,
    marginTop: 4,
  },

  daySection: {
    borderTopWidth: 1,
    borderTopColor: "lightgray",
    fontWeight: "normal",
    marginTop: 8,
    paddingTop: 16,
  },

  dayTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },

  listItem: {
    marginLeft: 8,
    marginBottom: 8,
  },

  tipsHeader: {
    fontSize: 12,
    fontWeight: "bold",
    margin: 4,
  },

  footer: {
    color: "gray",
    fontSize: 10,
    marginTop: "auto",
    textAlign: "center",
  },
});

function InlineMdToPdfComponents({ md }: { md: string }) {
  const tokens = marked.lexer(md);
  const elements: ReactElement[] = [];

  tokens.forEach((block, blockIndex) => {
    if (block.type === "paragraph") {
      block.tokens?.forEach((token: any, tokenIndex: number) => {
        const key = `${blockIndex}-${tokenIndex}`;

        switch (token.type) {
          case "strong":
            elements.push(
              <Text key={key} style={{ fontWeight: "bold" }}>
                {token.text}
              </Text>
            );
            break;

          case "em":
            elements.push(
              <Text key={key} style={{ fontStyle: "italic" }}>
                {token.text}
              </Text>
            );
            break;

          default:
            elements.push(<Text key={key}>{token.raw || ""}</Text>);
            break;
        }
      });
    }
  });

  return <Text>{elements}</Text>;
}

export default function ItineraryPdfDocument({
  itinerary,
}: {
  itinerary: ItineraryData;
}) {
  const cleanItinerary = {
    ...itinerary,
    destination: removeEmojis(itinerary.destination),
    dayItineraries: itinerary.dayItineraries.map((d) => ({
      ...d,
      title: removeEmojis(d.title),
      activities: d.activities.map(removeEmojis),
      tips: d.tips?.map(removeEmojis) ?? [],
    })),
    createdAt: new Date(itinerary.createdAt * 1000).toLocaleDateString("pt-BR"),
  };

  return (
    <PDFViewer width="100%" height="100%">
      <Document
        title="Roteiro PDF | TravelApp"
        author="TravelApp by Excursia Viagens"
        subject="Itinerário de viagem"
        keywords="roteiro, itinerário, viagem, travelapp"
      >
        <Page size="A4" style={styles.page}>
          <View>
            <Text style={styles.title}>{cleanItinerary.destination}</Text>
            <Text style={styles.meta}>
              {cleanItinerary.numberOfDays} dias • Gerado em{" "}
              {cleanItinerary.createdAt} • Valores em R$
            </Text>
          </View>

          {cleanItinerary.dayItineraries.map((day) => (
            <View key={day.day} style={styles.daySection}>
              <Text style={styles.dayTitle}>
                Dia {day.day} — {day.title}
              </Text>

              <View>
                {day.activities.map((act, i) => (
                  <Text key={i} style={styles.listItem}>
                    • <InlineMdToPdfComponents md={act} />
                  </Text>
                ))}
              </View>

              {day.tips && day.tips.length > 0 && (
                <View>
                  <Text style={styles.tipsHeader}>Dicas</Text>
                  {day.tips.map((tip, i) => (
                    <Text key={i} style={styles.listItem}>
                      {`${i + 1}.`} <InlineMdToPdfComponents md={tip} />
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}

          <View style={styles.footer}>
            <Text>
              Roteiro gerado por TravelApp by Excursia Viagens •{" "}
              {new Date().toLocaleDateString("pt-BR")}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

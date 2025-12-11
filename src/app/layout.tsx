import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const appFont = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Travelapp by Excursia Viagens - Roteiros Inteligentes",
  description:
    "Crie roteiros de viagem personalizados com inteligência artificial. Planeje sua próxima aventura!",
  manifest: "/manifest.json",
  keywords: [
    "viagem",
    "roteiro",
    "turismo",
    "IA",
    "inteligência artificial",
    "planejamento",
  ],
  authors: [{ name: "Excursia Viagens" }],
  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TravelApp",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "TravelApp",
    title: "TravelApp by Excursia Viagens",
    description:
      "Crie roteiros de viagem personalizados com inteligência artificial",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelApp by Excursia Viagens",
    description:
      "Crie roteiros de viagem personalizados com inteligência artificial",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={appFont.className}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={`font-sans antialiased`}>
        {
          <>
            {children}
            <Toaster richColors />
          </>
        }
      </body>
    </html>
  );
}

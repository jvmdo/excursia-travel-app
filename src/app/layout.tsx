import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Travelapp by Excursia Viagens - Roteiros Inteligentes",
  description: "Crie roteiros de viagem personalizados com inteligência artificial. Planeje sua próxima aventura!",
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
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Travelapp",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Travelapp",
    title: "Travelapp by Excursia Viagens",
    description:
      "Crie roteiros de viagem personalizados com inteligência artificial",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travelapp by Excursia Viagens",
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
    <html lang="pt-BR">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

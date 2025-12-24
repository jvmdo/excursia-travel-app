import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Sora, Inter } from "next/font/google";
import { Toaster } from "sonner";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
        url: "/logo-excursia.png",
        type: "image/png",
      },
      {
        url: "/android-chrome-192x192.png",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
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
    <html lang="pt-BR" className={`${sora.variable} ${inter.variable}`}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster
          richColors
          closeButton
          toastOptions={{
            classNames: {
              title: "font-semibold!",
              actionButton: "bg-blue-500! hover:bg-blue-700!",
            },
          }}
        />
      </body>
    </html>
  );
}

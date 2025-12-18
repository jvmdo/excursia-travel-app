import type React from "react";
import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals-photo.css";

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
  title: "Excursia Photos | Suas memórias organizadas em álbuns",
  description: "Organize suas fotos de viagem forma simples e elegante",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
  // <ThemeProvider
  //   attribute="class"
  //   defaultTheme="system"
  //   enableSystem
  //   disableTransitionOnChange
  // >
  //   {children}
  // </ThemeProvider>
}

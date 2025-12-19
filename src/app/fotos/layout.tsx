import type React from "react";
import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals-photo.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const _sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const _inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Excursia Photos | Suas memórias organizadas em álbuns",
  description: "Organize suas fotos de viagem forma simples e elegante",
};

export default function AlbumsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SidebarInset>{children}</SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}

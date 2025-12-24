import type React from "react";
import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

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

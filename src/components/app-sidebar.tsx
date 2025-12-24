import { BookImage, BotMessageSquare, MonitorDown, Plane } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ConfirmLogoutDialog } from "@/components/confirm-logout-dialog";
import Link from "next/link";
import { AppShortcutInstructions } from "@/components/app-shortcut-instructions";

const navItems = [
  {
    title: "Gerador de itinerários",
    url: "/criar-roteiro",
    icon: BotMessageSquare,
  },
  {
    title: "Criação de álbuns",
    url: "/fotos",
    icon: BookImage,
  },
];

const configItems = [
  {
    title: "Adicionar à tela inicial",
    icon: MonitorDown,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Plane className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
          </div>
          <h2 className="text-base md:text-xl font-bold font-display text-foreground">
            Excursia Produtos
          </h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Para suas viagens</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Facilidades</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map(({ title, icon: Icon }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild>
                    <AppShortcutInstructions>
                      <Icon /> {title}
                    </AppShortcutInstructions>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <ConfirmLogoutDialog />
      </SidebarFooter>
    </Sidebar>
  );
}

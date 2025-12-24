"use client";

import { Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

function isIOS() {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function AppShortcutInstructions({
  children,
}: {
  children: ReactNode[];
}) {
  const ios = isIOS();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start cursor-pointer"
        >
          {children}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl flex flex-col items-center gap-2">
            <Smartphone size={32} />
            Adicionar atalho do app no seu dispositivo
          </DialogTitle>
        </DialogHeader>

        {ios ? <IOSInstructions /> : <AndroidInstructions />}
      </DialogContent>
    </Dialog>
  );
}

function IOSInstructions() {
  return (
    <ol className="space-y-4 text-base">
      <li className="flex gap-3">
        <Step>1</Step>
        <p>
          Abra este site no <strong>Safari</strong>.
        </p>
      </li>
      <li className="flex gap-3">
        <Step>2</Step>
        <p>
          Toque no botão <strong>Compartilhar</strong> (ícone de seta para
          cima).
        </p>
      </li>
      <li className="flex gap-3">
        <Step>3</Step>
        <p>
          Selecione <strong>“Adicionar à Tela de Início”</strong>.
        </p>
      </li>
      <li className="flex gap-3">
        <Step>4</Step>
        <p>
          Toque em <strong>“Adicionar”</strong>.
        </p>
      </li>
    </ol>
  );
}

function AndroidInstructions() {
  return (
    <ol className="space-y-4 text-base">
      <li className="flex gap-3">
        <Step>1</Step>
        <p>
          Abra este site no <strong>Chrome</strong>.
        </p>
      </li>
      <li className="flex gap-3">
        <Step>2</Step>
        <p>
          Toque no menu <strong>⋮</strong> (canto superior direito).
        </p>
      </li>
      <li className="flex gap-3">
        <Step>3</Step>
        <p>
          Selecione <strong>“Adicionar à tela inicial”</strong>.
        </p>
      </li>
      <li className="flex gap-3">
        <Step>4</Step>
        <p>
          Confirme tocando em <strong>“Adicionar”</strong>.
        </p>
      </li>
    </ol>
  );
}

function Step({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
      {children}
    </div>
  );
}

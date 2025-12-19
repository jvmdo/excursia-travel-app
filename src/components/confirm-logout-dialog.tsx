"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function ConfirmLogoutDialog() {
  const { signOut } = useAuth();
  const { setOpen } = useSidebar();

  const handleConfirmLogout = async () => {
    const result = await signOut();

    if (!result.success) {
      toast.error("Erro ao desconectar", {
        description: result.error,
      });
      return;
    }

    setOpen(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          👋 Sair
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex gap-2">
            <span>👋</span> Desconectar?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Você será desconectado da sua conta. Faça login novamente para
            retornar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row flex-wrap *:flex-1">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmLogout}>
            Desconectar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

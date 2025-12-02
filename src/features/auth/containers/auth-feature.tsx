"use client";

import { useCallback } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { ConfirmLogoutDialog } from "@/features/auth/components/confirm-logout-dialog";
import { useToast } from "@/hooks/use-toast";

export function AuthFeature() {
  const { logoutDialogOpen, setLogoutDialogOpen, signOut } = useAuth();
  const { toast } = useToast();

  const handleConfirmLogout = useCallback(async () => {
    const result = await signOut();
    if (result.success) {
      toast({
        title: "Até logo!",
        description: "Você foi desconectado com sucesso.",
      });
    } else {
      toast({
        title: "❌ Erro ao desconectar",
        description: result.error ?? "Tente novamente.",
        variant: "destructive",
      });
    }
    setLogoutDialogOpen(false);
  }, [signOut, setLogoutDialogOpen, toast]);

  return (
    <>
      <LogoutButton onClick={() => setLogoutDialogOpen(true)} />

      <ConfirmLogoutDialog
        open={logoutDialogOpen}
        onOpenChange={(open) => setLogoutDialogOpen(open)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}

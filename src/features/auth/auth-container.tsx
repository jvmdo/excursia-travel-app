"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { ConfirmLogoutDialog } from "@/features/auth/components/confirm-logout-dialog";
import { toast } from "sonner";

export function AuthContainer() {
  const { signOut } = useAuth();

  const handleConfirmLogout = async () => {
    const result = await signOut();
    if (!result.success) {
      toast.error("Event has been created", {
        description: result.error,
      });
    }
  };

  return <ConfirmLogoutDialog onConfirm={handleConfirmLogout} />;
}

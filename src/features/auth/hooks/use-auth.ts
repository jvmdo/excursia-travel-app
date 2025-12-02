"use client";

import { useCallback, useState } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

/**
 * useAuth
 *
 * - manages logout dialog state
 * - performs sign-out via Supabase client
 * - redirects to login page after successful sign-out
 */
export function useAuth() {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const router = useRouter();

  const signOut = useCallback(async () => {
    const supabase = createSupabaseClient();
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redirect to login page (client-side)
      router.push("/auth/login");
      return { success: true };
    } catch (err) {
      // bubble error to caller
      return {
        success: false,
        error: (err as Error).message || "Erro ao desconectar",
      };
    }
  }, [router]);

  return {
    logoutDialogOpen,
    setLogoutDialogOpen,
    signOut,
  };
}

"use client";

import { useCallback } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  const signOut = useCallback(async () => {
    const supabase = createSupabaseClient();
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.push("/auth/login");
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: (err as Error).message || "Erro ao desconectar",
      };
    }
  }, [router]);

  return {
    signOut,
  };
}

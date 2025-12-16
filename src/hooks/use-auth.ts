"use client";

import { useCallback } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { translateSupabaseError } from "@/lib/utils";
import { AuthError } from "@supabase/supabase-js";

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
        error: translateSupabaseError(err as AuthError),
      };
    }
  }, [router]);

  return {
    signOut,
  };
}

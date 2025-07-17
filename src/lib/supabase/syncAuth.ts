import { supabase } from "./client";

export function syncSupabaseAuth() {
  const token = localStorage.getItem("auth_token");
  if (token) {
    // Untuk supabase-js v2
    supabase.auth.setSession({ access_token: token, refresh_token: "" });
  }
}

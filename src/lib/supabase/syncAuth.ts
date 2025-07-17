import { supabase } from "./client";

export function syncSupabaseAuth() {
  const token = localStorage.getItem("auth_token");
  if (token) {
    supabase.auth.setSession({ access_token: token, refresh_token: "" });
  }
}

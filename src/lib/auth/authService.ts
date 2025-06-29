import { supabase } from "../supabase/client";
import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "../../types";

export class AuthService {
  static async signUp(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            username: credentials.username,
          },
        },
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      if (data.user) {
        // Create user profile in users table
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          email: credentials.email,
          username: credentials.username,
          is_online: true,
          last_seen: new Date().toISOString(),
        });

        if (profileError) {
          console.error("Error creating user profile:", profileError);
        }
      }

      return {
        user: data.user
          ? {
              id: data.user.id,
              email: data.user.email!,
              username: credentials.username,
              avatar_url: data.user.user_metadata?.avatar_url,
            }
          : null,
        session: data.session,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: "An unexpected error occurred",
      };
    }
  }

  static async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { user: null, session: null, error: error.message };
      }

      if (data.user) {
        // Update user online status
        await supabase
          .from("users")
          .update({
            is_online: true,
            last_seen: new Date().toISOString(),
          })
          .eq("id", data.user.id);

        // Get user profile
        const { data: profile } = await supabase
          .from("users")
          .select("username, avatar_url")
          .eq("id", data.user.id)
          .single();

        return {
          user: {
            id: data.user.id,
            email: data.user.email!,
            username: profile?.username || "Unknown",
            avatar_url: profile?.avatar_url,
          },
          session: data.session,
        };
      }

      return { user: null, session: null };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: "An unexpected error occurred",
      };
    }
  }

  static async signOut(): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Update user offline status
        await supabase
          .from("users")
          .update({
            is_online: false,
            last_seen: new Date().toISOString(),
          })
          .eq("id", user.id);
      }

      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data: profile } = await supabase
        .from("users")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      return {
        id: user.id,
        email: user.email!,
        username: profile?.username || "Unknown",
        avatar_url: profile?.avatar_url,
      };
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  static async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  }
}

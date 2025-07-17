import { create } from "zustand";
import { AuthService } from "../../lib/auth/authService";
import { ChatService } from "../../lib/chat/chatService";
import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from "../../types";
import { supabase } from "../../lib/supabase/client";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: RegisterCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<AuthUser | null>;
  clearError: () => void;
  setUser: (user: AuthUser | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  signIn: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await AuthService.signIn(credentials);
      if (response.error) {
        set({ error: response.error, isLoading: false });
      } else if (response.user) {
        // Upsert user ke tabel users
        await supabase.from("users").upsert([
          {
            id: response.user.id,
            email: response.user.email,
            username: response.user.username,
            avatar_url: response.user.avatar_url,
            is_online: true,
            last_seen: new Date().toISOString(),
          },
        ]);
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      set({
        error: "An unexpected error occurred",
        isLoading: false,
      });
    }
  },

  signUp: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await AuthService.signUp(credentials);
      if (response.error) {
        set({ error: response.error, isLoading: false });
      } else if (response.user) {
        // Upsert user ke tabel users
        await supabase.from("users").upsert([
          {
            id: response.user.id,
            email: response.user.email,
            username: response.user.username,
            avatar_url: response.user.avatar_url,
            is_online: true,
            last_seen: new Date().toISOString(),
          },
        ]);
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      set({
        error: "An unexpected error occurred",
        isLoading: false,
      });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      const { user } = get();
      if (user) {
        await ChatService.updateUserStatus(user.id, false);
      }
      await AuthService.signOut();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: "Error signing out",
        isLoading: false,
      });
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const user = await AuthService.getCurrentUser();
      if (user) {
        // Upsert user ke tabel users
        await supabase.from("users").upsert([
          {
            id: user.id,
            email: user.email,
            username: user.username,
            avatar_url: user.avatar_url,
            is_online: true,
            last_seen: new Date().toISOString(),
          },
        ]);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return user;
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return null;
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return null;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setUser: (user: AuthUser | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },
}));

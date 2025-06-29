import { create } from "zustand";
import { AuthService } from "../../lib/auth/authService";
import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from "../../types";

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
  getCurrentUser: () => Promise<void>;
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
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
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

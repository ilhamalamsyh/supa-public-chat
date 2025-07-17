import { ApiService } from "../api/apiService";
import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "../../types";

export class AuthService {
  static async signUp(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const payload = {
        email: credentials.email,
        password: credentials.password,
        name: credentials.username, // API expects 'name' field
      };

      const response = await ApiService.post<{
        user?: {
          id: string;
          email: string;
          name: string;
        };
        token?: string;
        message?: string;
        error?: string;
      }>("/auth/register", payload);

      if (response.error) {
        return { user: null, session: null, error: response.error };
      }

      if (response.user && response.token) {
        // Store the token in localStorage for future requests
        localStorage.setItem("auth_token", response.token);
        return {
          user: {
            id: response.user.id,
            email: response.user.email,
            username: response.user.name,
            avatar_url: undefined,
          },
          session: { access_token: response.token },
        };
      }

      return { user: null, session: null, error: "Registration failed" };
    } catch (error) {
      return {
        user: null,
        session: null,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }

  static async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const payload = {
        email: credentials.email,
        password: credentials.password,
      };

      const response = await ApiService.post<{
        user?: {
          id: string;
          email: string;
          name: string;
        };
        token?: string;
        message?: string;
        error?: string;
      }>("/auth/login", payload);

      if (response.error) {
        return { user: null, session: null, error: response.error };
      }

      if (response.user && response.token) {
        // Store the token in localStorage for future requests
        localStorage.setItem("auth_token", response.token);

        return {
          user: {
            id: response.user.id,
            email: response.user.email,
            username: response.user.name,
            avatar_url: undefined,
          },
          session: { access_token: response.token },
        };
      }

      return { user: null, session: null, error: "Login failed" };
    } catch (error) {
      return {
        user: null,
        session: null,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }
  }

  static async signOut(): Promise<void> {
    try {
      // Remove token from localStorage
      localStorage.removeItem("auth_token");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return null;
      const res = await fetch(
        "https://hono-supa-api.vercel.app/api/user/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      const user = data.user;
      if (!res.ok || !user || !user.id) return null;
      return {
        id: user.id,
        email: user.email,
        username: user.name,
        avatar_url: user.avatar_url,
      };
    } catch (error) {
      return null;
    }
  }

  static async getSession() {
    const token = localStorage.getItem("auth_token");
    return token ? { access_token: token } : null;
  }
}

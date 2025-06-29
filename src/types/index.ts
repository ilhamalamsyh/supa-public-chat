export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  last_seen: string;
  is_online: boolean;
}

export interface Message {
  id: string;
  content: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  online_users_count: number;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: any | null;
  error?: string;
}

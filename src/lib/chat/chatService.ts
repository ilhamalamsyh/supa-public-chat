import { supabase } from "../supabase/client";
import type { Message, User } from "../../types";

export class ChatService {
  static async getMessages(limit = 50): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching messages:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  static async sendMessage(
    content: string,
    userId: string,
    username: string,
    avatarUrl?: string
  ): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          content,
          user_id: userId,
          username,
          avatar_url: avatarUrl,
        })
        .select()
        .single();

      if (error) {
        console.error("Error sending message:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  }

  static async getOnlineUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("is_online", true)
        .order("last_seen", { ascending: false });

      if (error) {
        console.error("Error fetching online users:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching online users:", error);
      return [];
    }
  }

  static async updateUserStatus(
    userId: string,
    isOnline: boolean
  ): Promise<void> {
    try {
      await supabase
        .from("users")
        .update({
          is_online: isOnline,
          last_seen: new Date().toISOString(),
        })
        .eq("id", userId);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  }

  static subscribeToMessages(callback: (message: Message) => void) {
    return supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();
  }

  static subscribeToUserStatus(callback: (user: User) => void) {
    return supabase
      .channel("user_status")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
        },
        (payload) => {
          callback(payload.new as User);
        }
      )
      .subscribe();
  }

  static unsubscribe(channel: any) {
    supabase.removeChannel(channel);
  }
}

import { supabase } from "../supabase/client";
import type { Message, User } from "../../types";

export class ChatService {
  static async getPublicRoomId(): Promise<string | null> {
    const { data, error } = await supabase
      .from("rooms")
      .select("id")
      .eq("is_public", true)
      .limit(1)
      .single();
    if (error || !data) return null;
    return data.id;
  }

  static async getMessages(
    roomId: string,
    limit = 10,
    before?: string // ISO string of created_at
  ): Promise<Message[]> {
    console.log("[ChatService.getMessages] params:", { roomId, limit, before });
    try {
      let query = supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (before) {
        query = query.lt("created_at", before);
      }
      const { data, error } = await query;
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
    roomId: string,
    username: string,
    avatarUrl?: string
  ): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          content,
          user_id: userId,
          room_id: roomId,
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
      console.log("Fetching online users...");
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("is_online", true)
        .order("last_seen", { ascending: false });

      console.log("getOnlineUsers result:", { data, error });

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
      console.log(`Updating user ${userId} status to ${isOnline}`);
      const { data, error } = await supabase
        .from("users")
        .update({
          is_online: isOnline,
          last_seen: new Date().toISOString(),
        })
        .eq("id", userId);

      console.log("updateUserStatus result:", { data, error });

      if (error) {
        console.error("Error updating user status:", error);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  }

  static subscribeToMessages(
    roomId: string,
    callback: (message: Message) => void
  ) {
    return supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
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
          event: "INSERT",
          schema: "public",
          table: "users",
        },
        (payload) => {
          console.log("Realtime INSERT user:", payload);
          callback(payload.new as User);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
        },
        (payload) => {
          console.log("Realtime UPDATE user:", payload);
          callback(payload.new as User);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "users",
        },
        (payload) => {
          console.log("Realtime DELETE user:", payload);
          callback(payload.old as User);
        }
      )
      .subscribe();
  }

  static unsubscribe(channel: any) {
    supabase.removeChannel(channel);
  }
}

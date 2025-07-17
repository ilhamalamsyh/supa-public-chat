import { create } from "zustand";
import { ChatService } from "../../lib/chat/chatService";
import { supabase } from "../../lib/supabase/client";
import type { Message, User } from "../../types";

interface ChatState {
  messages: Message[];
  onlineUsers: User[];
  isLoading: boolean;
  error: string | null;
  messageChannel: any;
  userStatusChannel: any;
  publicRoomId: string | null;
  presenceChannel: any; // presence channel supabase
}

interface ChatActions {
  loadMessages: () => Promise<void>;
  sendMessage: (
    content: string,
    userId: string,
    username: string,
    avatarUrl?: string
  ) => Promise<void>;
  loadOnlineUsers: () => Promise<void>;
  addMessage: (message: Message) => void;
  updateUserStatus: (user: User) => void;
  subscribeToMessages: (roomId: string) => void;
  subscribeToUserStatus: () => void;
  unsubscribe: () => void;
  clearError: () => void;
  setPublicRoomId: (id: string) => void;
  subscribeToPresence: (roomId: string, user: User) => void;
  unsubscribePresence: () => void;
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  messages: [],
  onlineUsers: [],
  isLoading: false,
  error: null,
  messageChannel: null,
  userStatusChannel: null,
  publicRoomId: "29c284fe-30d2-4d09-a982-6b2aac5a70d3", // langsung pakai id room public dari user
  presenceChannel: null,

  setPublicRoomId: (id: string) => set({ publicRoomId: id }),

  loadMessages: async () => {
    set({ isLoading: true, error: null });
    try {
      const { publicRoomId } = get();
      if (!publicRoomId)
        return set({ error: "No public room found", isLoading: false });
      const messages = await ChatService.getMessages(publicRoomId);
      set({ messages: messages.reverse(), isLoading: false });
    } catch (error) {
      set({
        error: "Failed to load messages",
        isLoading: false,
      });
    }
  },

  sendMessage: async (
    content: string,
    userId: string,
    username: string,
    avatarUrl?: string
  ) => {
    try {
      const { publicRoomId } = get();
      if (!publicRoomId) return set({ error: "No public room found" });
      await ChatService.sendMessage(
        content,
        userId,
        publicRoomId,
        username,
        avatarUrl
      );
    } catch (error) {
      set({ error: "Failed to send message" });
    }
  },

  loadOnlineUsers: async () => {
    try {
      const users = await ChatService.getOnlineUsers();
      set({ onlineUsers: users });
    } catch (error) {
      set({ error: "Failed to load online users" });
    }
  },

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  updateUserStatus: (user: User) => {
    set((state) => ({
      onlineUsers: state.onlineUsers.map((u) => (u.id === user.id ? user : u)),
    }));
  },

  subscribeToMessages: (roomId: string) => {
    const { messageChannel } = get();
    if (messageChannel) return;

    const channel = ChatService.subscribeToMessages(roomId, (message) => {
      get().addMessage(message);
    });

    set({ messageChannel: channel });
  },

  subscribeToUserStatus: () => {
    const { userStatusChannel } = get();
    if (userStatusChannel) return;

    const channel = ChatService.subscribeToUserStatus(async () => {
      // Setiap ada perubahan status user, refresh seluruh daftar online user
      await get().loadOnlineUsers();
    });

    set({ userStatusChannel: channel });
  },

  unsubscribe: () => {
    const { messageChannel, userStatusChannel } = get();

    if (messageChannel) {
      ChatService.unsubscribe(messageChannel);
    }

    if (userStatusChannel) {
      ChatService.unsubscribe(userStatusChannel);
    }

    set({ messageChannel: null, userStatusChannel: null });
  },

  clearError: () => {
    set({ error: null });
  },

  // === Presence Supabase ===
  subscribeToPresence: (roomId: string, user: User) => {
    const { presenceChannel } = get();
    if (presenceChannel) return;
    const channel = supabase.channel(`room-presence-${roomId}`, {
      config: { presence: { key: user.id } },
    });
    channel.subscribe((status: string) => {
      if (status === "SUBSCRIBED") {
        channel.track({
          id: user.id,
          username: user.username,
          avatar_url: user.avatar_url,
        });
      }
    });
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      // Map ke User[] dengan field default agar sesuai tipe
      const users = Object.values(state)
        .flat()
        .filter(Boolean)
        .map((u: any) => ({
          id: u.id,
          username: u.username,
          avatar_url: u.avatar_url,
          email: "",
          created_at: "",
          last_seen: "",
          is_online: true,
        }));
      set({ onlineUsers: users });
    });
    set({ presenceChannel: channel });
  },
  unsubscribePresence: () => {
    const { presenceChannel } = get();
    if (presenceChannel) {
      presenceChannel.unsubscribe();
      set({ presenceChannel: null, onlineUsers: [] });
    }
  },
}));

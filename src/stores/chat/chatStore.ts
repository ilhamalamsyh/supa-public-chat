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
  hasMore: boolean;
  isLoadingMore: boolean;
  oldestLoadedMessage: Message | null;
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
  loadOlderMessages: () => Promise<void>;
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  messages: [],
  onlineUsers: [],
  isLoading: false,
  error: null,
  messageChannel: null,
  userStatusChannel: null,
  publicRoomId: "29c284fe-30d2-4d09-a982-6b2aac5a70d3",
  presenceChannel: null,
  hasMore: true,
  isLoadingMore: false,
  oldestLoadedMessage: null,

  setPublicRoomId: (id: string) => set({ publicRoomId: id }),

  loadMessages: async () => {
    set({ isLoading: true, error: null });
    console.log("[chatStore] loadMessages dipanggil");
    try {
      const { publicRoomId } = get();
      if (!publicRoomId)
        return set({ error: "No public room found", isLoading: false });
      const messages = await ChatService.getMessages(publicRoomId, 10);
      console.log("[chatStore] loadMessages hasil:", messages);
      set({
        messages: messages.reverse(),
        isLoading: false,
        hasMore: messages.length === 10,
        oldestLoadedMessage:
          messages.length > 0 ? messages[messages.length - 1] : null,
      });
    } catch (error) {
      set({
        error: "Failed to load messages",
        isLoading: false,
      });
    }
  },

  loadOlderMessages: async () => {
    const {
      publicRoomId,
      oldestLoadedMessage,
      messages,
      isLoadingMore,
      hasMore,
    } = get();
    if (!publicRoomId || isLoadingMore || !hasMore) return;
    set({ isLoadingMore: true });
    console.log(
      "[chatStore] loadOlderMessages dipanggil, before:",
      oldestLoadedMessage?.created_at
    );
    try {
      const before = oldestLoadedMessage?.created_at;
      const olderMessages = await ChatService.getMessages(
        publicRoomId,
        10,
        before
      );
      console.log("[chatStore] loadOlderMessages hasil:", olderMessages);
      // Filter pesan lama yang belum ada di messages
      const uniqueOlder = olderMessages.filter(
        (msg) => !messages.some((m) => m.id === msg.id)
      );
      const newMessages = [...uniqueOlder.reverse(), ...messages];
      console.log("[chatStore] messages setelah prepend:", newMessages);
      set({
        messages: newMessages,
        isLoadingMore: false,
        hasMore: olderMessages.length === 10,
        oldestLoadedMessage:
          olderMessages.length > 0
            ? olderMessages[olderMessages.length - 1]
            : oldestLoadedMessage,
      });
    } catch (error) {
      set({ isLoadingMore: false });
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
    set((state) => {
      // Debug log
      console.log("[addMessage] Dapat pesan realtime:", message);
      // Cek apakah pesan sudah ada (hindari duplikat)
      if (state.messages.some((m) => m.id === message.id)) {
        console.log("[addMessage] Pesan sudah ada, skip:", message.id);
        return {};
      }
      // Guard: hanya tambahkan jika pesan lebih baru dari pesan terakhir
      if (state.messages.length > 0) {
        const lastMsg = state.messages[state.messages.length - 1];
        if (new Date(message.created_at) <= new Date(lastMsg.created_at)) {
          console.log(
            "[addMessage] Pesan bukan yang terbaru, skip:",
            message.id
          );
          return {};
        }
      }
      return {
        messages: [...state.messages, message],
      };
    });
  },

  updateUserStatus: (user: User) => {
    set((state) => ({
      onlineUsers: state.onlineUsers.map((u) => (u.id === user.id ? user : u)),
    }));
  },

  subscribeToMessages: (roomId: string) => {
    const { messageChannel } = get();
    if (messageChannel) return;
    console.log(
      "[chatStore] subscribeToMessages dipanggil untuk room:",
      roomId
    );
    const channel = ChatService.subscribeToMessages(roomId, (message) => {
      console.log("[subscribeToMessages] Pesan realtime diterima:", message);
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

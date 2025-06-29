import { create } from "zustand";
import { ChatService } from "../../lib/chat/chatService";
import type { Message, User } from "../../types";

interface ChatState {
  messages: Message[];
  onlineUsers: User[];
  isLoading: boolean;
  error: string | null;
  messageChannel: any;
  userStatusChannel: any;
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
  subscribeToMessages: () => void;
  subscribeToUserStatus: () => void;
  unsubscribe: () => void;
  clearError: () => void;
}

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  onlineUsers: [],
  isLoading: false,
  error: null,
  messageChannel: null,
  userStatusChannel: null,

  loadMessages: async () => {
    set({ isLoading: true, error: null });
    try {
      const messages = await ChatService.getMessages();
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
      const message = await ChatService.sendMessage(
        content,
        userId,
        username,
        avatarUrl
      );
      if (message) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      }
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

  subscribeToMessages: () => {
    const { messageChannel } = get();
    if (messageChannel) return;

    const channel = ChatService.subscribeToMessages((message) => {
      get().addMessage(message);
    });

    set({ messageChannel: channel });
  },

  subscribeToUserStatus: () => {
    const { userStatusChannel } = get();
    if (userStatusChannel) return;

    const channel = ChatService.subscribeToUserStatus((user) => {
      get().updateUserStatus(user);
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
}));

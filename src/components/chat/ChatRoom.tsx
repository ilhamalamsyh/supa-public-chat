import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "../../stores/auth/authStore";
import { useChatStore } from "../../stores/chat/chatStore";
import { formatMessageTime } from "../../utils/dateUtils";
import { validateMessage } from "../../utils/validation";
import { syncSupabaseAuth } from "../../lib/supabase/syncAuth";
import { supabase } from "../../lib/supabase/client";
import { ChatService } from "../../lib/chat/chatService";

const ChatRoom: React.FC = () => {
  const { user, signOut, getCurrentUser, isLoading } = useAuthStore();
  const {
    messages,
    isLoading: chatLoading,
    error,
    loadMessages,
    loadOlderMessages,
    isLoadingMore,
    hasMore,
    sendMessage,
    unsubscribe,
    publicRoomId,
    subscribeToMessages,
    subscribeToPresence,
    unsubscribePresence,
  } = useChatStore();

  const [newMessage, setNewMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomName, setRoomName] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // Gabungkan state untuk initial load dan scroll
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  // State untuk deteksi apakah user sedang di bawah
  const [isAtBottom, setIsAtBottom] = useState(true);
  // State untuk simpan posisi pesan teratas sebelum load older
  const topMessageRef = useRef<HTMLDivElement | null>(null);
  const [showManualLoad, setShowManualLoad] = useState(false);
  // State untuk simpan posisi scroll sebelum load older
  const prevScrollHeightRef = useRef<number | null>(null);
  const prevScrollTopRef = useRef<number | null>(null);

  useEffect(() => {
    syncSupabaseAuth();
    if (!user && localStorage.getItem("auth_token")) {
      getCurrentUser();
    }
    // Set user online saat masuk chat
    if (user) {
      ChatService.updateUserStatus(user.id, true);
    }
    // Heartbeat: update status online setiap 15 detik
    let interval: NodeJS.Timeout | undefined;
    if (user) {
      interval = setInterval(() => {
        ChatService.updateUserStatus(user.id, true);
      }, 15000);
    }
    // Set user offline saat keluar chat atau tab ditutup
    function handleUnload() {
      if (user) {
        ChatService.updateUserStatus(user.id, false);
      }
    }
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      if (user) {
        ChatService.updateUserStatus(user.id, false);
      }
      if (interval) clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    // Fetch room name by id
    const fetchRoom = async () => {
      setRoomLoading(true);
      if (publicRoomId) {
        const { data } = await supabase
          .from("rooms")
          .select("name")
          .eq("id", publicRoomId)
          .single();
        if (data && data.name) setRoomName(data.name);
      }
      setRoomLoading(false);
    };
    fetchRoom();
  }, [publicRoomId]);

  // Initial load & subscribe
  useEffect(() => {
    if (user && publicRoomId && !roomLoading && !hasLoadedInitial) {
      console.log("[ChatRoom] Memanggil loadMessages (initial load)");
      loadMessages();
      setHasLoadedInitial(true);
    }
    if (user && publicRoomId && !roomLoading) {
      subscribeToMessages(publicRoomId);
    }
    return () => {
      unsubscribe();
    };
  }, [user, publicRoomId, roomLoading, hasLoadedInitial]);

  // Scroll ke bawah HANYA setelah initial load
  useEffect(() => {
    if (
      hasLoadedInitial &&
      !hasScrolledToBottom &&
      messages.length > 0 &&
      !chatLoading
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      setHasScrolledToBottom(true);
      console.log("[ChatRoom] Scroll ke bawah setelah initial load");
    }
  }, [hasLoadedInitial, hasScrolledToBottom, messages.length, chatLoading]);

  // Presence Supabase
  useEffect(() => {
    if (user && publicRoomId) {
      // Map AuthUser ke User agar sesuai tipe
      const userForPresence = {
        ...user,
        created_at: "",
        last_seen: "",
        is_online: true,
      };
      subscribeToPresence(publicRoomId, userForPresence);
    }
    return () => {
      unsubscribePresence();
    };
  }, [user, publicRoomId]);

  // Cek apakah container bisa di-scroll (overflow)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    setShowManualLoad(container.scrollHeight <= container.clientHeight);
  }, [messages.length]);

  // Scroll handler untuk lazy load & update isAtBottom
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || isLoadingMore || !hasMore) return;
    // Lazy load jika di atas
    if (container.scrollTop < 60) {
      // Simpan posisi scroll sebelum load
      prevScrollHeightRef.current = container.scrollHeight;
      prevScrollTopRef.current = container.scrollTop;
      loadOlderMessages();
    }
    // Deteksi apakah user di bawah (20px dari bottom)
    const isBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      20;
    setIsAtBottom(isBottom);
  }, [isLoadingMore, hasMore, loadOlderMessages, messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Setelah pesan lama dimuat, restore posisi scroll agar smooth (tanpa loncatan)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (
      container &&
      prevScrollHeightRef.current !== null &&
      prevScrollTopRef.current !== null
    ) {
      const prevScrollHeight = prevScrollHeightRef.current;
      const prevScrollTop = prevScrollTopRef.current;
      requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop =
          prevScrollTop + (newScrollHeight - prevScrollHeight);
        prevScrollHeightRef.current = null;
        prevScrollTopRef.current = null;
      });
    }
  }, [messages.length]);

  // Auto-scroll ke bawah jika pesan baru masuk & user memang di bawah
  useEffect(() => {
    if (
      hasScrolledToBottom &&
      isAtBottom &&
      messages.length > 0 &&
      !chatLoading
    ) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isAtBottom, hasScrolledToBottom, chatLoading]);

  // Setelah mengirim pesan sendiri, selalu scroll ke bawah
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!publicRoomId) return setMessageError("Room not found");
    const validation = validateMessage(newMessage);
    if (!validation.isValid) {
      setMessageError(validation.errors[0]);
      return;
    }
    setMessageError("");
    await sendMessage(newMessage, user.id, user.username, user.avatar_url);
    setNewMessage("");
    // Scroll ke bawah setelah kirim pesan
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Tombol manual load older hanya jika belum bisa scroll
  const handleManualLoadOlder = () => {
    const container = messagesContainerRef.current;
    if (container) {
      prevScrollHeightRef.current = container.scrollHeight;
      prevScrollTopRef.current = container.scrollTop;
    }
    loadOlderMessages();
  };

  if (!user) {
    if (isLoading) {
      return <div>Loading user...</div>;
    }
    return <div>Access Denied. Please log in to access the chat room.</div>;
  }

  if (roomLoading || !publicRoomId) {
    return <div>Loading chat room...</div>;
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#181c23",
      }}
    >
      {/* Tombol manual load older hanya jika belum bisa scroll */}
      {showManualLoad && (
        <button
          onClick={handleManualLoadOlder}
          style={{
            margin: 8,
            padding: 8,
            background: "#a259ff",
            color: "#fff",
            border: 0,
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Load Older Messages (10)
        </button>
      )}
      {/* Messages */}
      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "16px 16px 0 16px", // padding kiri-kanan agar bubble tidak mepet
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minHeight: 0,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {isLoadingMore && (
          <div style={{ textAlign: "center", color: "#aaa", marginBottom: 8 }}>
            Loading more messages...
          </div>
        )}
        {chatLoading ? (
          <div style={{ textAlign: "center", color: "#aaa" }}>
            Loading messages...
          </div>
        ) : error ? (
          <div
            style={{
              color: "#e53e3e",
              background: "#2d193c",
              border: "1px solid #a259ff",
              borderRadius: 8,
              padding: 12,
            }}
          >
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#aaa" }}>
            No messages yet. Be the first to start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} id={`msg-${msg.id}`}>
              <div
                style={{
                  display: "flex",
                  flexDirection:
                    msg.user_id === user.id ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    maxWidth: "min(70vw, 400px)", // responsif, tidak terlalu lebar
                    width: "fit-content",
                    background:
                      msg.user_id === user.id
                        ? "linear-gradient(90deg,#a259ff,#6a36fc)"
                        : "#232837",
                    color: msg.user_id === user.id ? "#fff" : "#e0e0e0",
                    borderRadius:
                      msg.user_id === user.id
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    padding: "8px 14px",
                    fontSize: 15,
                    boxShadow:
                      msg.user_id === user.id
                        ? "0 2px 8px #a259ff22"
                        : "0 1px 4px #0002",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      marginBottom: 4,
                      color: "#a259ff",
                      display: msg.user_id === user.id ? "none" : "block",
                    }}
                  >
                    {msg.user_id === user.id ? null : msg.username}
                  </div>
                  <div>{msg.content}</div>
                  {/* Bubble Tail */}
                  {msg.user_id === user.id ? (
                    <span
                      style={{
                        position: "absolute",
                        right: -10,
                        bottom: 0,
                        width: 12,
                        height: 16,
                        background: "transparent",
                        clipPath: "polygon(0 0, 100% 50%, 0 100%)",
                        backgroundColor: "#6a36fc",
                        zIndex: 2,
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        position: "absolute",
                        left: -10,
                        bottom: 0,
                        width: 12,
                        height: 16,
                        background: "transparent",
                        clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
                        backgroundColor: "#232837",
                        zIndex: 2,
                      }}
                    />
                  )}
                  <div
                    style={{
                      fontSize: 11,
                      color: msg.user_id === user.id ? "#e0d7ff" : "#888",
                      marginTop: 4,
                      textAlign: "right",
                    }}
                  >
                    {formatMessageTime(msg.created_at)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input Bar */}
      <form
        onSubmit={handleSendMessage}
        style={{
          background: "#23213a",
          borderTop: "1px solid #23213a",
          padding: 18,
          display: "flex",
          gap: 12,
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            if (messageError) setMessageError("");
          }}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 10,
            border: "1.5px solid #3a2a5d",
            background: "#181c23",
            color: "#fff",
            fontSize: 15,
            outline: "none",
          }}
          maxLength={1000}
        />
        <button
          type="submit"
          aria-label="Send message"
          title="Send"
          style={{
            background: "linear-gradient(90deg,#a259ff,#6a36fc)",
            color: "#fff",
            border: 0,
            borderRadius: 10,
            padding: 0,
            fontWeight: 700,
            fontSize: 18,
            cursor: "pointer",
            boxShadow: "0 2px 8px #a259ff22",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 52,
            width: 52,
            minWidth: 52,
            minHeight: 52,
          }}
          disabled={!newMessage.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: "rotate(45deg)" }}
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
      {messageError && (
        <div
          style={{
            color: "#e53e3e",
            background: "#2d193c",
            border: "1px solid #a259ff",
            borderRadius: 8,
            padding: 8,
            margin: 8,
          }}
        >
          {messageError}
        </div>
      )}
    </div>
  );
};

export default ChatRoom;

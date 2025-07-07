import "../styles/global.css";
import React, { useRef, useEffect, useState } from "react";

const initialMessages = [
  {
    id: 1,
    user: "dailycodingdemo",
    avatar: "/avatars/harry.png",
    time: "Fri Jan 05 2024",
    content: "Hello",
    edited: false,
  },
  {
    id: 2,
    user: "dailycodingdemo",
    avatar: "/avatars/harry.png",
    time: "Fri Jan 05 2024",
    content: "Hello update",
    edited: true,
  },
  {
    id: 3,
    user: "dailycodingdemo",
    avatar: "/avatars/harry.png",
    time: "Fri Jan 05 2024",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
    edited: false,
  },
  {
    id: 4,
    user: "Harry Potter",
    avatar: "/avatars/harry.png",
    time: "22:18",
    content: "Wow, man, this is my favorite place).",
  },
  {
    id: 5,
    user: "Severus Snape",
    avatar: "/avatars/snape.png",
    time: "22:19",
    content: `I'll be passing through Hogwarts soon, we can meet at the same place.)`,
  },
  {
    id: 6,
    user: "Harry Potter",
    avatar: "/avatars/harry.png",
    time: "22:17",
    content: `This is a great idea! I'll take Ron and Hermione with me.`,
  },
  {
    id: 7,
    user: "Hermione Granger",
    avatar: "/avatars/hermione.png",
    time: "11:30",
    content: `Yay! I'm so excited!`,
  },
  {
    id: 8,
    user: "Ron Weasley",
    avatar: "/avatars/ron.png",
    time: "11:33",
    content: `I'm in.`,
  },
  {
    id: 9,
    user: "Ginny Weasley",
    avatar: "/avatars/ginny.png",
    time: "11:35",
    content: "",
    voice: true,
  },
];

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    // console.log("handleSend called");
    e.preventDefault();
    e.stopPropagation();
    if (!input.trim()) return false;
    const newMsg = {
      id: messages.length + 1,
      user: "You",
      avatar: "/avatars/harry.png",
      time: new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      content: input,
      edited: false,
    };
    setMessages([...messages, newMsg]);
    setInput("");
    return false;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-[#232837]">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3">
            <img
              src={msg.avatar}
              alt={msg.user}
              className="w-10 h-10 rounded-full object-cover mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-white text-base">
                  {msg.user}
                </span>
                <span className="text-xs text-gray-400">{msg.time}</span>
                {msg.edited && (
                  <span className="text-xs text-gray-500 italic ml-2">
                    edited
                  </span>
                )}
              </div>
              <div className="bg-[#181c23] text-gray-100 rounded-2xl px-5 py-3 shadow max-w-2xl text-sm break-words">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Input Bar */}
      <form
        className="flex items-center gap-4 px-6 py-4 border-t border-[#232837]/60 bg-[#232837] sticky bottom-0"
        onSubmit={handleSend}
        autoComplete="off"
      >
        <input
          type="text"
          placeholder="send message"
          className="flex-1 py-3 px-5 rounded-xl bg-[#181c23] border border-[#232837] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white transition shadow-md"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;

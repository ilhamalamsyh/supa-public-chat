import React from "react";
import "../styles/global.css";

const chats = [
  {
    id: 1,
    name: "Harry Potter",
    avatar: "/avatars/harry.png",
    lastMessage: "2 New messages",
    time: "11:30",
    unread: 2,
  },
  {
    id: 2,
    name: "James Potter",
    avatar: "/avatars/james.png",
    lastMessage: "Let's meet today?",
    time: "11:25",
    unread: 1,
  },
  {
    id: 3,
    name: "Lily Potter",
    avatar: "/avatars/lily.png",
    lastMessage: "Very interesting film! Rec...",
    time: "11:09",
    unread: 0,
  },
  {
    id: 4,
    name: "Severus Snape",
    avatar: "/avatars/snape.png",
    lastMessage: "Severus is typing...",
    time: "10:54",
    unread: 0,
    typing: true,
  },
  {
    id: 5,
    name: "Sirius Black",
    avatar: "/avatars/sirius.png",
    lastMessage: "Are you here?",
    time: "10:54",
    unread: 0,
  },
  {
    id: 6,
    name: "Ginny Weasley",
    avatar: "/avatars/ginny.png",
    lastMessage: "🎤 Voice message",
    time: "9:32",
    unread: 0,
  },
  {
    id: 7,
    name: "Hermione Granger",
    avatar: "/avatars/hermione.png",
    lastMessage: "Alright, lets keep go...",
    time: "9:12",
    unread: 0,
  },
];

const ChatList: React.FC = () => {
  return (
    <aside className="w-full md:w-80 bg-white h-full rounded-none md:rounded-l-3xl flex flex-col border-r border-gray-100 shadow-xl">
      <div className="px-6 pt-8 pb-4">
        <h2 className="text-2xl font-semibold mb-6">Message</h2>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 pl-10 pr-4 rounded-xl bg-[#f5f7fa] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <svg
            className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f5f7fa] cursor-pointer transition-all mb-1"
          >
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 truncate">
                  {chat.name}
                </span>
                <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                  {chat.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm truncate ${
                    chat.typing ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  {chat.lastMessage}
                </span>
                {chat.unread > 0 && (
                  <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ChatList;

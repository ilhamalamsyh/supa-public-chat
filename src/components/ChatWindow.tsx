import { useRef, useEffect } from "react";

const messages = [
  {
    id: 1,
    user: "Severus Snape",
    avatar: "/avatars/snape.png",
    time: "22:15",
    content: "What a beautiful place we have here at Hogwarts...",
    image: "/photos/sunflowers.jpg",
  },
  {
    id: 2,
    user: "Harry Potter",
    avatar: "/avatars/harry.png",
    time: "22:18",
    content: "Wow, man, this is my favorite place).",
  },
  {
    id: 3,
    user: "Severus Snape",
    avatar: "/avatars/snape.png",
    time: "22:19",
    content: `I'll be passing through Hogwarts soon, we can meet at the same place.)`,
  },
  {
    id: 4,
    user: "Harry Potter",
    avatar: "/avatars/harry.png",
    time: "22:17",
    content: `This is a great idea! I'll take Ron and Hermione with me.`,
  },
  {
    id: 5,
    user: "Hermione Granger",
    avatar: "/avatars/hermione.png",
    time: "11:30",
    content: `Yay! I'm so excited!`,
  },
  {
    id: 6,
    user: "Ron Weasley",
    avatar: "/avatars/ron.png",
    time: "11:33",
    content: `I'm in.`,
  },
  {
    id: 7,
    user: "Ginny Weasley",
    avatar: "/avatars/ginny.png",
    time: "11:35",
    content: "",
    voice: true,
  },
];

const ChatWindow: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section className="flex-1 flex flex-col bg-[#f5f7fa] h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white rounded-tr-3xl">
        <div>
          <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
            <img
              src="/avatars/group.png"
              alt="Group"
              className="w-8 h-8 rounded-full"
            />
            Friendly chat
          </h3>
          <span className="text-xs text-gray-400">11 members, 5 online</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.553-2.276A2 2 0 0021 6.382V5a2 2 0 00-2-2H5a2 2 0 00-2 2v1.382a2 2 0 00 1.447 1.342L9 10m6 0v10a2 2 0 01-2 2H7a2 2 0 01-2-2V10m6 0V4"
              />
            </svg>
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.553-2.276A2 2 0 0021 6.382V5a2 2 0 00-2-2H5a2 2 0 00-2 2v1.382a2 2 0 00 1.447 1.342L9 10m6 0v10a2 2 0 01-2 2H7a2 2 0 01-2-2V10m6 0V4"
              />
            </svg>
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-end gap-3">
            <img
              src={msg.avatar}
              alt={msg.user}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 text-sm">
                  {msg.user}
                </span>
                <span className="text-xs text-gray-400">{msg.time}</span>
              </div>
              {msg.content && (
                <div className="bg-white rounded-2xl px-5 py-3 shadow text-gray-800 max-w-lg mb-1">
                  {msg.content}
                </div>
              )}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="shared"
                  className="rounded-xl max-w-xs mb-1"
                />
              )}
              {msg.voice && (
                <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-2">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19V6a2 2 0 012-2h2a2 2 0 012 2v13"
                    />
                  </svg>
                  <span className="text-xs text-gray-500">Voice message</span>
                  <span className="text-xs text-gray-400">0:27</span>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Message Input */}
      <form className="flex items-center gap-4 px-8 py-6 border-t border-gray-100 bg-white rounded-b-3xl">
        <input
          type="text"
          placeholder="Message"
          className="flex-1 py-3 px-5 rounded-xl bg-[#f5f7fa] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="button"
          className="p-3 rounded-xl hover:bg-blue-100 transition"
        >
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A2 2 0 0021 6.382V5a2 2 0 00-2-2H5a2 2 0 00-2 2v1.382a2 2 0 00 1.447 1.342L9 10m6 0v10a2 2 0 01-2 2H7a2 2 0 01-2-2V10m6 0V4"
            />
          </svg>
        </button>
        <button
          type="submit"
          className="p-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition"
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
    </section>
  );
};

export default ChatWindow;

import "../styles/global.css";
import React, { useState } from "react";
console.log("ResponsiveChatLayout loaded!");
import Sidebar from "./Sidebar";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import ProfilePanel from "./ProfilePanel";

const ResponsiveChatLayout: React.FC = () => {
  const [activeMobileView, setActiveMobileView] = useState<
    "chatlist" | "chatwindow" | "profile"
  >("chatlist");

  return (
    <div className="min-h-screen bg-[#eaf0f3] flex items-center justify-center">
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full max-w-[1600px] h-[900px] rounded-3xl shadow-2xl overflow-hidden">
        <Sidebar />
        <ChatList />
        <ChatWindow />
        <ProfilePanel />
      </div>
      {/* Mobile Layout */}
      <div className="flex flex-col w-full h-screen md:hidden bg-[#eaf0f3]">
        {/* Mobile Nav */}
        <div className="flex justify-between items-center px-4 py-2 bg-white/80 shadow border-b border-gray-100">
          <button
            className={`flex-1 py-2 ${
              activeMobileView === "chatlist"
                ? "text-green-600 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveMobileView("chatlist")}
          >
            Chats
          </button>
          <button
            className={`flex-1 py-2 ${
              activeMobileView === "chatwindow"
                ? "text-green-600 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveMobileView("chatwindow")}
          >
            Chat Room
          </button>
          <button
            className={`flex-1 py-2 ${
              activeMobileView === "profile"
                ? "text-green-600 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveMobileView("profile")}
          >
            Profile
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {activeMobileView === "chatlist" && (
            <div className="h-full">
              <ChatList />
            </div>
          )}
          {activeMobileView === "chatwindow" && (
            <div className="h-full">
              <ChatWindow />
            </div>
          )}
          {activeMobileView === "profile" && (
            <div className="h-full">
              <ProfilePanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveChatLayout;

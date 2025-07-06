import "../styles/global.css";
import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useAuthStore } from "../stores/auth/authStore";

const ResponsiveChatLayout: React.FC = () => {
  const { signOut } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await signOut();
    window.location.href = "/login";
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-[#181c23] flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-2xl bg-[#232837] rounded-2xl shadow-2xl border border-[#232837]/80 flex flex-col h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232837]/60 bg-[#232837] rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-white">Daily Chat</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-green-300 font-medium">
                1 online
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-md"
          >
            Logout
          </button>
        </div>
        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatWindow />
        </div>
        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-[#232837] rounded-xl shadow-xl p-8 max-w-xs w-full text-center border border-[#232837]/80">
              <h3 className="text-lg font-bold text-white mb-4">
                Confirm Logout
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to logout?
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={confirmLogout}
                  className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={cancelLogout}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsiveChatLayout;

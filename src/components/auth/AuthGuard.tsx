import React, { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      const isLoginOrRegister =
        window.location.pathname === "/login" ||
        window.location.pathname === "/register";
      if (!token) {
        window.location.href = "/login";
        return;
      }
      // Validate token with backend if possible
      try {
        const res = await fetch(
          "https://hono-supa-api.vercel.app/api/user/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (res.ok) {
          setIsValid(true);
          if (isLoginOrRegister) {
            window.history.replaceState(null, "", "/chat");
            window.location.href = "/chat";
          }
        } else if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("auth_token");
          window.location.href = "/login";
        } else {
          // Log error lain, jangan hapus token
          console.error("AuthGuard: Unexpected error", await res.text());
        }
      } catch (err) {
        console.error("AuthGuard error:", err);
        // Jangan hapus token di sini!
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, []);

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background-main">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-purple rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-gray-300 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isValid) return null;
  return <>{children}</>;
};

export default AuthGuard;

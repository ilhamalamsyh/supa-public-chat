import React from "react";
import "../styles/global.css";

const navItems = [
  {
    icon: (
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
          d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0H7m6 0v6m0 0H7m6 0h6"
        />
      </svg>
    ),
    label: "Home",
    href: "#",
  },
  {
    icon: (
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
          d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    label: "Chat",
    href: "#",
  },
  {
    icon: (
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
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
    label: "Settings",
    href: "#",
  },
  {
    icon: (
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
          d="M17 16l4-4m0 0l-4-4m4 4H7"
        />
      </svg>
    ),
    label: "Logout",
    href: "#",
  },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-full md:w-20 flex flex-col items-center bg-[#eaf0f3] h-full py-8 rounded-none md:rounded-l-3xl shadow-xl">
      <div className="mb-12">
        <span className="text-2xl font-bold text-orange-500 tracking-wide">
          Cors
        </span>
      </div>
      <nav className="flex flex-col gap-8 flex-1">
        {navItems.map((item, idx) => (
          <a
            key={item.label}
            href={item.href}
            className="flex flex-col items-center group"
          >
            <div className="p-3 rounded-xl group-hover:bg-white group-hover:shadow transition-all">
              {item.icon}
            </div>
            <span className="sr-only">{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

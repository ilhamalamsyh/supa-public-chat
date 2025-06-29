import React from "react";

const user = {
  name: "Harry Potter",
  avatar: "/avatars/harry.png",
  posts: 47,
  followers: 302,
  following: 81,
};

const members = [
  "/avatars/snape.png",
  "/avatars/hermione.png",
  "/avatars/ron.png",
  "/avatars/ginny.png",
  "/avatars/lily.png",
];

const photos = [
  "/photos/forest1.jpg",
  "/photos/forest2.jpg",
  "/photos/animal.jpg",
];

const videos = ["/photos/sunflowers.jpg", "/photos/forest1.jpg"];

const links = [
  { label: "Labrodrik", url: "http://www.labrodrik.com" },
  { label: "Hashpshere", url: "http://www.hashpshere.com" },
  { label: "Comconect", url: "http://www.comconect.com" },
];

const ProfilePanel: React.FC = () => {
  return (
    <aside className="w-96 bg-white h-full rounded-r-3xl flex flex-col border-l border-gray-100 shadow-xl p-8">
      <div className="flex flex-col items-center mb-8">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover mb-3"
        />
        <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
        <span className="text-sm text-orange-500 mt-1">My account</span>
        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <div className="font-bold text-lg">{user.posts}</div>
            <div className="text-xs text-gray-400">Posts</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{user.followers}</div>
            <div className="text-xs text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{user.following}</div>
            <div className="text-xs text-gray-400">Following</div>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-2">Notifications</h4>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          No new notifications
        </div>
      </div>
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-2">Members</h4>
        <div className="flex -space-x-3">
          {members.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="member"
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
              style={{ zIndex: 10 - idx }}
            />
          ))}
          <span className="ml-4 text-xs text-gray-400">+40</span>
        </div>
      </div>
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-2">Shared Photos</h4>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {photos.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="shared"
              className="w-20 h-16 object-cover rounded-lg"
            />
          ))}
        </div>
        <a href="#" className="text-xs text-blue-500 hover:underline">
          See all
        </a>
      </div>
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-2">Shared Videos</h4>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {videos.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="video"
              className="w-28 h-16 object-cover rounded-lg"
            />
          ))}
        </div>
        <a href="#" className="text-xs text-blue-500 hover:underline">
          See all
        </a>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Shared Links</h4>
        <ul className="space-y-1">
          {links.map((link, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.828 10.172a4 4 0 010 5.656m-1.414-1.414a2 2 0 010-2.828m2.828-2.828a4 4 0 00-5.656 0l-3.536 3.536a4 4 0 105.656 5.656l1.414-1.414"
                />
              </svg>
              <a
                href={link.url}
                className="text-xs text-gray-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default ProfilePanel;

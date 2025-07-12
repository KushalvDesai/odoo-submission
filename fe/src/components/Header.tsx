"use client";
import React, { useState } from "react";
import { useNotification } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

const BellIcon = ({ hasUnread, onClick }: { hasUnread: boolean; onClick: () => void }) => (
  <button onClick={onClick} className="relative ml-4 p-2 rounded-full hover:bg-[#40444b] transition">
    <span className="material-symbols-outlined text-white text-2xl">notifications</span>
    {hasUnread && (
      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#f04747] rounded-full border-2 border-[#2b2d31]" />
    )}
  </button>
);

const NotificationIcon = ({ type }: { type?: string }) => {
  switch (type) {
    case 'answer':
      return <span className="material-symbols-outlined text-[#5865f2] text-sm mr-2">question_answer</span>;
    case 'mention':
      return <span className="material-symbols-outlined text-[#f04747] text-sm mr-2">alternate_email</span>;
    case 'comment':
      return <span className="material-symbols-outlined text-[#57f287] text-sm mr-2">comment</span>;
    default:
      return <span className="material-symbols-outlined text-[#b5bac1] text-sm mr-2">notifications</span>;
  }
};

const NotificationDropdown = ({ open }: { open: boolean }) => {
  const { notifications } = useNotification();
  const router = useRouter();
  
  if (!open) return null;
  
  const handleNotificationClick = (link?: string) => {
    if (link) {
      router.push(link);
    }
  };
  
  return (
    <div className="absolute right-0 mt-2 w-80 bg-[#23272a] rounded-xl shadow-lg z-50 border border-[#40444b]">
      <div className="p-4 border-b border-[#40444b] text-white font-semibold flex items-center justify-between">
        <span>Notifications</span>
        <span className="text-xs text-[#b5bac1]">{notifications.length} total</span>
      </div>
      <ul className="max-h-80 overflow-y-auto">
        {notifications.length === 0 && (
          <li className="p-4 text-[#b5bac1] text-sm text-center">No notifications</li>
        )}
        {notifications.slice(0, 10).map(n => (
          <li 
            key={n.id} 
            className={`px-4 py-3 border-b border-[#40444b] cursor-pointer hover:bg-[#313338] transition ${
              n.isRead ? "bg-transparent" : "bg-[#313338]"
            }`}
            onClick={() => handleNotificationClick(n.link)}
          >
            <div className="flex items-start">
              <NotificationIcon type={n.type} />
              <div className="flex-1">
                <div className="text-white text-sm leading-relaxed">{n.message}</div>
                <div className="text-xs text-[#b5bac1] mt-1">
                  {n.createdAt.toLocaleString()}
                  {!n.isRead && <span className="ml-2 text-[#f04747]">• New</span>}
                </div>
              </div>
            </div>
          </li>
        ))}
        {notifications.length > 10 && (
          <li className="p-3 text-center">
            <span className="text-xs text-[#b5bac1]">+{notifications.length - 10} more notifications</span>
          </li>
        )}
      </ul>
    </div>
  );
};

const ProfileDropdown = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div className="absolute right-0 mt-2 w-40 bg-[#23272a] rounded-xl shadow-lg z-50 border border-[#40444b]">
      <button onClick={onLogout} className="w-full text-left px-4 py-3 text-white hover:bg-[#313338] rounded-xl">Logout</button>
    </div>
  );
};

const Header = () => {
  const { unreadCount, markAllRead } = useNotification();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  const handleBellClick = () => {
    setDropdownOpen(open => {
      if (!open) markAllRead();
      return !open;
    });
  };

  const handleProfileClick = () => setProfileOpen(open => !open);

  return (
    <header className="w-full flex items-center justify-between bg-[#2b2d31] text-white px-4 sm:px-8 py-4 shadow-md border-b border-[#23272a] font-sans relative">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/")} className="text-2xl font-bold tracking-wide hover:underline">StackIt</button>
        {user && (
          <button 
            onClick={() => router.push("/ask")} 
            className="hidden sm:flex items-center gap-2 bg-[#5865f2] px-4 py-2 rounded-lg hover:bg-[#4752c4] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Ask Question
          </button>
        )}
      </div>
      <div className="flex items-center relative">
        {!user ? (
          <>
            <button onClick={() => router.push("/login")} className="bg-[#5865f2] border-none rounded-lg px-6 py-2 text-white font-semibold hover:bg-[#4752c4] transition-colors shadow">Login</button>
            <button onClick={() => router.push("/register")} className="ml-2 bg-[#40444b] border-none rounded-lg px-6 py-2 text-white font-semibold hover:bg-[#5865f2] transition-colors shadow">Register</button>
          </>
        ) : (
          <>
            <BellIcon hasUnread={unreadCount > 0} onClick={handleBellClick} />
            <div className="relative">
              <button onClick={handleProfileClick} className="ml-4 flex items-center gap-2 px-3 py-1 rounded-full bg-[#40444b] hover:bg-[#5865f2]">
                <span className="material-symbols-outlined text-white">account_circle</span>
                <span className="hidden sm:inline text-white text-sm">{user.email.split("@")[0]}</span>
              </button>
              {profileOpen && <ProfileDropdown onLogout={logout} />}
            </div>
          </>
        )}
        <div className="relative">
          <NotificationDropdown open={dropdownOpen} />
        </div>
      </div>
    </header>
  );
};

export default Header; 
"use client";
import React, { useState } from "react";
import { useNotification } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Bell, User, LogOut, Settings, Plus, MessageSquare } from 'lucide-react';

const BellIcon = ({ hasUnread, onClick }: { hasUnread: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className="relative p-2 rounded-full bg-background-secondary border border-border-primary hover:border-border-secondary transition-all duration-300 hover-lift hover-glow group"
  >
    <Bell className="w-5 h-5 text-foreground-secondary group-hover:text-foreground-primary transition-colors" />
    {hasUnread && (
      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-background-primary animate-pulse" />
    )}
  </button>
);

const NotificationIcon = ({ type }: { type?: string }) => {
  const iconClass = "w-4 h-4 mr-2";
  switch (type) {
    case 'answer':
      return <MessageSquare className={`${iconClass} text-accent-primary`} />;
    case 'mention':
      return <User className={`${iconClass} text-error`} />;
    case 'comment':
      return <MessageSquare className={`${iconClass} text-success`} />;
    default:
      return <Bell className={`${iconClass} text-foreground-tertiary`} />;
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
    <div className="absolute right-0 mt-2 w-80 card z-50 animate-scale-in">
      <div className="flex items-center justify-between p-4 border-b border-border-primary">
        <span className="font-semibold text-foreground-primary">Notifications</span>
        <span className="text-xs text-foreground-tertiary">{notifications.length} total</span>
      </div>
      <ul className="max-h-80 overflow-y-auto">
        {notifications.length === 0 && (
          <li className="p-4 text-foreground-tertiary text-sm text-center">No notifications</li>
        )}
        {notifications.slice(0, 10).map(n => (
          <li 
            key={n.id} 
            className={`px-4 py-3 border-b border-border-primary cursor-pointer hover:bg-background-tertiary transition-colors ${
              n.isRead ? "bg-transparent" : "bg-accent-tertiary"
            }`}
            onClick={() => handleNotificationClick(n.link)}
          >
            <div className="flex items-start">
              <NotificationIcon type={n.type} />
              <div className="flex-1">
                <div className="text-foreground-primary text-sm leading-relaxed">{n.message}</div>
                <div className="text-xs text-foreground-tertiary mt-1">
                  {n.createdAt.toLocaleString()}
                  {!n.isRead && <span className="ml-2 text-error">• New</span>}
                </div>
              </div>
            </div>
          </li>
        ))}
        {notifications.length > 10 && (
          <li className="p-3 text-center">
            <span className="text-xs text-foreground-tertiary">+{notifications.length - 10} more notifications</span>
          </li>
        )}
      </ul>
    </div>
  );
};

const ProfileDropdown = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div className="absolute right-0 mt-2 w-48 card z-50 animate-scale-in">
      <button 
        onClick={onLogout} 
        className="w-full text-left px-4 py-3 text-foreground-primary hover:bg-background-tertiary rounded-lg transition-colors flex items-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
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
    <header className="w-full flex items-center justify-between glass border-b border-border-primary px-4 sm:px-8 py-4 shadow-md backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push("/")} 
          className="text-2xl font-bold tracking-wide gradient-text hover-scale transition-transform"
        >
          StackIt
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <button 
              onClick={() => router.push("/login")} 
              className="btn btn-secondary hover-scale"
            >
              Login
            </button>
            <button 
              onClick={() => router.push("/register")} 
              className="btn btn-primary hover-scale"
            >
              Register
            </button>
          </>
        ) : (
          <>
            <BellIcon hasUnread={unreadCount > 0} onClick={handleBellClick} />
            <div className="relative">
              <button 
                onClick={handleProfileClick} 
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-background-secondary border border-border-primary hover:border-border-secondary transition-all duration-300 hover-lift"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:inline text-sm font-medium text-foreground-primary">
                  {user.email.split("@")[0]}
                </span>
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
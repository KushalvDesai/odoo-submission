"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Notification = {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: Date;
  link?: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notif: Omit<Notification, "id" | "isRead" | "createdAt">) => void;
  markAllRead: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Example mock notifications
    { id: 1, message: "User X answered your question: 'How to join 2 columns...'", isRead: false, createdAt: new Date(), link: "/question/1" },
    { id: 2, message: "@you was mentioned in an answer", isRead: false, createdAt: new Date(), link: "/question/1" },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (notif: Omit<Notification, "id" | "isRead" | "createdAt">) => {
    setNotifications(prev => [
      { id: Date.now(), message: notif.message, isRead: false, createdAt: new Date(), link: notif.link },
      ...prev,
    ]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
} 
"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@apollo/client";
import { GET_NOTIFICATIONS } from "../lib/graphql-queries";
import { useAuth } from "./AuthContext";

export type Notification = {
  id: string;
  userId: string;
  type: 'answer' | 'mention' | 'comment' | string;
  message: string;
  read: boolean;
  meta?: any;
  createdAt: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  refetchNotifications: () => void;
  // Optionally: markAllRead, markOneRead, etc.
  createMentionNotification: (mentionedUser: string, questionerName: string, questionId: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { data, loading, error, refetch } = useQuery<{ notifications: Notification[] }>(GET_NOTIFICATIONS, {
    skip: !user,
    fetchPolicy: "network-only",
  });

  const notifications: Notification[] = data?.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  // Dummy implementation, replace with actual logic as needed
  const createMentionNotification = (mentionedUser: string, questionerName: string, questionId: string) => {
    // Implement notification creation logic here (e.g., call a mutation or update state)
    console.warn("createMentionNotification called", { mentionedUser, questionerName, questionId });
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      refetchNotifications: () => refetch(),
      createMentionNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
} 
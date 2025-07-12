"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Notification = {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: Date;
  link?: string;
  type?: 'answer' | 'mention' | 'comment';
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notif: Omit<Notification, "id" | "isRead" | "createdAt">) => void;
  markAllRead: () => void;
  createAnswerNotification: (questionTitle: string, answererName: string, questionId: string) => void;
  createMentionNotification: (mentionedUser: string, mentionerName: string, questionId: string) => void;
  createCommentNotification: (commenterName: string, questionId: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Enhanced mock notifications
    { 
      id: 1, 
      message: "Alice answered your question: 'How to join 2 columns in a data set to make a separate column in SQL'", 
      isRead: false, 
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      link: "/question/1",
      type: 'answer'
    },
    { 
      id: 2, 
      message: "@you was mentioned in an answer by Bob", 
      isRead: false, 
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      link: "/question/1",
      type: 'mention'
    },
    { 
      id: 3, 
      message: "Charlie commented on your answer", 
      isRead: true, 
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      link: "/question/2",
      type: 'comment'
    },
    { 
      id: 4, 
      message: "Dana answered your question: 'How to center a div in CSS?'", 
      isRead: true, 
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      link: "/question/2",
      type: 'answer'
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (notif: Omit<Notification, "id" | "isRead" | "createdAt">) => {
    setNotifications(prev => [
      { id: Date.now(), message: notif.message, isRead: false, createdAt: new Date(), link: notif.link, type: notif.type },
      ...prev,
    ]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const createAnswerNotification = (questionTitle: string, answererName: string, questionId: string) => {
    const message = `${answererName} answered your question: '${questionTitle.length > 50 ? questionTitle.substring(0, 50) + '...' : questionTitle}'`;
    addNotification({
      message,
      link: `/question/${questionId}`,
      type: 'answer'
    });
  };

  const createMentionNotification = (mentionedUser: string, mentionerName: string, questionId: string) => {
    const message = `@${mentionedUser} was mentioned in an answer by ${mentionerName}`;
    addNotification({
      message,
      link: `/question/${questionId}`,
      type: 'mention'
    });
  };

  const createCommentNotification = (commenterName: string, questionId: string) => {
    const message = `${commenterName} commented on your answer`;
    addNotification({
      message,
      link: `/question/${questionId}`,
      type: 'comment'
    });
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      addNotification, 
      markAllRead,
      createAnswerNotification,
      createMentionNotification,
      createCommentNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
} 
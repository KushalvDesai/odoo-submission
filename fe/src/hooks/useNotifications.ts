
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_NOTIFICATIONS } from '../graphql/queries';
import { MARK_NOTIFICATION_READ, MARK_ALL_NOTIFICATIONS_READ } from '../graphql/mutations';

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedQuestion?: {
    id: string;
    title: string;
  };
  actor?: {
    id: string;
    username: string;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Mock data for demonstration
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'answer',
      message: 'Someone answered your question about React hooks',
      read: false,
      createdAt: '2 hours ago',
      relatedQuestion: {
        id: '1',
        title: 'How to use React hooks effectively?'
      },
      actor: {
        id: '2',
        username: 'react_expert'
      }
    },
    {
      id: '2',
      type: 'vote',
      message: 'Your answer received an upvote',
      read: false,
      createdAt: '4 hours ago',
      actor: {
        id: '3',
        username: 'developer123'
      }
    },
    {
      id: '3',
      type: 'mention',
      message: 'You were mentioned in a comment',
      read: true,
      createdAt: '1 day ago',
      actor: {
        id: '4',
        username: 'coder_girl'
      }
    },
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const [markAsReadMutation] = useMutation(MARK_NOTIFICATION_READ);
  const [markAllAsReadMutation] = useMutation(MARK_ALL_NOTIFICATIONS_READ);

  const markAsRead = async (notificationId: string) => {
    try {
      await markAsReadMutation({
        variables: { notificationId },
      });
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllAsReadMutation();
      
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};

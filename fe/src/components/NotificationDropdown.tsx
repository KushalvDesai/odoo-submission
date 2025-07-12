
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative text-white hover:bg-slate-700">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 border-slate-700 w-80" align="end">
        <div className="p-3 border-b border-slate-700">
          <h3 className="text-white font-semibold">Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-slate-400 text-center">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b border-slate-700 hover:bg-slate-700 cursor-pointer ${
                  !notification.read ? 'bg-slate-700/30' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="text-white text-sm">
                  {notification.message}
                </div>
                <div className="text-slate-400 text-xs mt-1">
                  {notification.createdAt}
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

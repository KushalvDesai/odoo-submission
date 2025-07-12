"use client";

import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNotification } from "../contexts/NotificationContext";
import { useRouter } from "next/navigation";
import { Bell, MessageSquare, User, AlertCircle } from "lucide-react";

interface NotificationDropdownProps {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ open, anchorRef, onClose }) => {
  const { notifications } = useNotification();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose, anchorRef]);

  // Position dropdown below anchor
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  useEffect(() => {
    if (open && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setStyle({
        position: "absolute",
        top: rect.bottom + 8 + window.scrollY,
        left: rect.right - 320 + window.scrollX, // 320 = dropdown width
        zIndex: 9999,
        minWidth: 320,
      });
    }
  }, [open, anchorRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      style={style}
      className="card animate-scale-in shadow-xl border border-border-primary"
    >
      <div className="flex items-center justify-between p-4 border-b border-border-primary">
        <span className="font-semibold text-foreground-primary">Notifications</span>
        <span className="text-xs text-foreground-tertiary">{notifications.length} total</span>
      </div>
      <ul className="max-h-80 overflow-y-auto">
        {notifications.length === 0 && (
          <li className="p-4 text-foreground-tertiary text-sm text-center">No notifications</li>
        )}
        {notifications.map(n => (
          <li
            key={n.id}
            className={`px-4 py-3 border-b border-border-primary cursor-pointer hover:bg-background-tertiary transition-colors ${
              n.read ? "bg-transparent" : "bg-accent-tertiary"
            }`}
            onClick={() => {
              if (n.meta?.link) router.push(n.meta.link);
              onClose();
            }}
          >
            <div className="flex items-start">
              {/* Icon by type */}
              {n.type === "answer" ? (
                <MessageSquare className="w-4 h-4 mr-2 text-accent-primary" />
              ) : n.type === "mention" ? (
                <User className="w-4 h-4 mr-2 text-error" />
              ) : n.type === "comment" ? (
                <AlertCircle className="w-4 h-4 mr-2 text-success" />
              ) : (
                <Bell className="w-4 h-4 mr-2 text-foreground-tertiary" />
              )}
              <div className="flex-1">
                <div className="text-foreground-primary text-sm leading-relaxed">{n.message}</div>
                <div className="text-xs text-foreground-tertiary mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                  {!n.read && <span className="ml-2 text-error">• New</span>}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>,
    document.body
  );
};

export default NotificationDropdown; 
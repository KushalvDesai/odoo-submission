"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, ThumbsUp, ThumbsDown, Clock, User, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type QuestionCardProps = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  user: string;
  answers: number;
  upvotes?: number;
  downvotes?: number;
  createdAt?: Date;
  onTagClick?: (tag: string) => void;
  currentUser?: { name: string; email: string } | null;
  onEdit?: () => void;
  onDelete?: () => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  id,
  title, 
  description, 
  tags, 
  user, 
  answers, 
  upvotes = 0,
  downvotes = 0,
  createdAt,
  onTagClick,
  currentUser,
  onEdit,
  onDelete
}) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const isOwner = currentUser && (currentUser.name === user || currentUser.email === user);

  const formatDate = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const handleCardClick = () => {
    router.push(`/question/${id}`);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <div 
      className="card hover-lift animate-fade-in cursor-pointer group relative"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground-primary group-hover:text-accent-primary transition-colors line-clamp-2 flex-1">
          {title}
        </h3>
        <div className="flex items-center space-x-2 ml-4">
          <div className="flex items-center space-x-1 text-xs text-foreground-tertiary">
            <Clock className="w-3 h-3" />
            <span>{formatDate(createdAt)}</span>
          </div>
          {isOwner && (
            <div className="relative" ref={menuRef} onClick={e => e.stopPropagation()}>
              <button
                className="p-1 rounded-full hover:bg-background-tertiary transition-colors"
                onClick={() => setMenuOpen(v => !v)}
                aria-label="More options"
              >
                <MoreVertical className="w-5 h-5 text-foreground-tertiary" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-32 card z-50 animate-scale-in">
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-background-tertiary text-foreground-primary"
                    onClick={e => { e.stopPropagation(); setMenuOpen(false); onEdit && onEdit(); }}
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </button>
                  <button
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-background-tertiary text-error"
                    onClick={e => { e.stopPropagation(); setMenuOpen(false); onDelete && onDelete(); }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-foreground-secondary mb-4 line-clamp-2">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, idx) => (
          <button
            key={idx}
            className="badge badge-primary hover-scale transition-all duration-200 text-xs"
            onClick={(e) => handleTagClick(e, tag)}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border-primary">
        <div className="flex items-center space-x-4 text-xs text-foreground-tertiary">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>{user}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-foreground-tertiary">
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-3 h-3" />
            <span className="font-medium text-foreground-secondary">{upvotes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ThumbsDown className="w-3 h-3" />
            <span className="font-medium text-foreground-secondary">{downvotes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-3 h-3" />
            <span className="font-medium text-foreground-secondary">{answers}</span>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-primary/5 to-accent-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default QuestionCard; 
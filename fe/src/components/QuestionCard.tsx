"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, ThumbsUp, ThumbsDown, Clock, User } from 'lucide-react';

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
  onTagClick 
}) => {
  const router = useRouter();

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
      className="card hover-lift animate-fade-in cursor-pointer group"
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
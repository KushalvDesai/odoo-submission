"use client";
import React from "react";
import { useRouter } from "next/navigation";

type QuestionCardProps = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  user: string;
  answers: number;
  upvotes?: number;
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
    // Navigate to question detail page using the question ID
    router.push(`/question/${id}`);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation(); // Prevent card click when clicking tag
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <div 
      className="bg-[#313338] text-white rounded-xl p-5 mb-4 shadow flex flex-col gap-2 relative font-sans transition hover:shadow-lg hover:bg-[#36393f] cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="text-lg font-semibold mb-1 line-clamp-2">{title}</div>
      <div className="text-sm text-[#b5bac1] mb-2 line-clamp-2">{description}</div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, idx) => (
          <button
            key={idx}
            className="bg-[#40444b] text-xs px-2 py-1 rounded-md text-[#b5bac1] hover:bg-[#5865f2] hover:text-white transition-colors"
            onClick={(e) => handleTagClick(e, tag)}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-[#b5bac1]">
        <div className="flex items-center gap-4">
          <span>by {user}</span>
          {createdAt && <span>{formatDate(createdAt)}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">thumb_up</span>
            {upvotes}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">question_answer</span>
            {answers}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard; 
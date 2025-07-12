"use client";
import React from "react";

type QuestionCardProps = {
  title: string;
  description: string;
  tags: string[];
  user: string;
  answers: number;
  onTagClick?: (tag: string) => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ title, description, tags, user, answers, onTagClick }) => {
  return (
    <div className="bg-[#313338] text-white rounded-xl p-5 mb-4 shadow flex flex-col gap-2 relative font-sans transition hover:shadow-lg hover:bg-[#36393f]">
      <div className="text-lg font-semibold mb-1">{title}</div>
      <div className="text-sm text-[#b5bac1] mb-2 line-clamp-2">{description}</div>
      <div className="flex flex-wrap gap-2 mb-1">
        {tags.map((tag, idx) => (
          <button
            key={idx}
            className="bg-[#40444b] text-xs px-2 py-1 rounded-md text-[#b5bac1] hover:bg-[#5865f2] hover:text-white transition-colors"
            onClick={onTagClick ? () => onTagClick(tag) : undefined}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="text-xs text-[#b5bac1]">{user}</div>
      <div className="absolute top-4 right-4 bg-[#40444b] text-white text-xs px-3 py-1 rounded-lg font-bold shadow">{answers} {answers === 1 ? "answer" : "answers"}</div>
    </div>
  );
};

export default QuestionCard; 
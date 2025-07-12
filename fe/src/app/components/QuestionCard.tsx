import React from "react";

type QuestionCardProps = {
  title: string;
  description: string;
  tags: string[];
  user: string;
  answers: number;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ title, description, tags, user, answers }) => {
  return (
    <div className="bg-[#313338] text-white rounded-xl p-5 mb-4 shadow flex flex-col gap-2 relative font-sans transition hover:shadow-lg hover:bg-[#36393f]">
      <div className="text-lg font-semibold mb-1">{title}</div>
      <div className="text-sm text-[#b5bac1] mb-2 line-clamp-2">{description}</div>
      <div className="flex flex-wrap gap-2 mb-1">
        {tags.map((tag, idx) => (
          <span key={idx} className="bg-[#40444b] text-xs px-2 py-1 rounded-md text-[#b5bac1]">{tag}</span>
        ))}
      </div>
      <div className="text-xs text-[#b5bac1]">{user}</div>
      <div className="absolute top-4 right-4 bg-[#40444b] text-white text-xs px-3 py-1 rounded-lg font-bold shadow">{answers} ans</div>
    </div>
  );
};

export default QuestionCard; 
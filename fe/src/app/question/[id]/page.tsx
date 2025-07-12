"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useNotification } from "../../components/NotificationContext";

const mockQuestion = {
  title: "How to join 2 columns in a data set to make a separate column in SQL",
  description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine ...",
  tags: ["SQL", "Join", "Beginner"],
  user: "User Name",
  answers: [
    { id: 1, text: "You can use CONCAT in SQL...", user: "Answerer1", upvotes: 2 },
    { id: 2, text: "Try using SELECT first_name || ' ' || last_name ...", user: "Answerer2", upvotes: 1 },
  ],
};

export default function QuestionDetailPage() {
  const [answers, setAnswers] = useState(mockQuestion.answers);
  const [answerText, setAnswerText] = useState("");
  const [upvoted, setUpvoted] = useState<{ [key: number]: boolean }>({});
  const { addNotification } = useNotification();

  const handleUpvote = (id: number) => {
    if (upvoted[id]) return;
    setAnswers(ans => ans.map(a => a.id === id ? { ...a, upvotes: a.upvotes + 1 } : a));
    setUpvoted(u => ({ ...u, [id]: true }));
  };

  const handleAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText) return;
    setAnswers(ans => [
      ...ans,
      { id: Date.now(), text: answerText, user: "You", upvotes: 0 },
    ]);
    // Trigger notification for answer
    addNotification({
      message: `You answered: '${mockQuestion.title}'`,
      link: "/question/1",
    });
    // Trigger mention notification if answer contains '@'
    if (answerText.includes("@")) {
      addNotification({
        message: `@username was mentioned in your answer`,
        link: "/question/1",
      });
    }
    setAnswerText("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#23272a] py-8">
      <div className="bg-[#313338] p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">{mockQuestion.title}</h2>
        <div className="text-[#b5bac1] mb-2">{mockQuestion.description}</div>
        <div className="flex gap-2 mb-4">
          {mockQuestion.tags.map((tag, idx) => (
            <span key={idx} className="bg-[#40444b] text-xs px-2 py-1 rounded-md text-[#b5bac1]">{tag}</span>
          ))}
        </div>
        <div className="text-xs text-[#b5bac1] mb-6">Asked by {mockQuestion.user}</div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Answers</h3>
          {answers.map(a => (
            <div key={a.id} className="bg-[#40444b] rounded-lg p-4 mb-3 flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="text-white mb-2 sm:mb-0">{a.text}</div>
              <div className="flex items-center gap-2">
                <span className="text-[#b5bac1] text-xs">by {a.user}</span>
                <button
                  className={`ml-4 px-3 py-1 rounded bg-[#5865f2] text-white font-bold disabled:bg-[#23272a] disabled:text-[#b5bac1]`}
                  onClick={() => handleUpvote(a.id)}
                  disabled={!!upvoted[a.id]}
                >
                  ▲ {a.upvotes}
                </button>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleAnswer} className="flex flex-col gap-2">
          <textarea
            placeholder="Your answer..."
            className="px-4 py-2 rounded bg-[#40444b] text-white placeholder-[#b5bac1] outline-none min-h-[80px]"
            value={answerText}
            onChange={e => setAnswerText(e.target.value)}
          />
          <button type="submit" className="bg-[#5865f2] text-white py-2 rounded font-semibold hover:bg-[#4752c4] transition self-end">Submit Answer</button>
        </form>
      </div>
    </div>
  );
} 
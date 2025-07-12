"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useNotification } from "../../components/NotificationContext";
import { useAuth } from "../../components/AuthContext";
import { parseMentions, validateMentions } from "../../utils/mentions";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const mockQuestion = {
  id: "1",
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
  const { createAnswerNotification, createMentionNotification } = useNotification();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const questionId = params.id as string;

  const handleUpvote = (id: number) => {
    if (!user || upvoted[id]) return;
    setAnswers(ans => ans.map(a => a.id === id ? { ...a, upvotes: a.upvotes + 1 } : a));
    setUpvoted(u => ({ ...u, [id]: true }));
  };

  const handleAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText || !user) return;
    
    const answererName = user.email.split("@")[0];
    const newAnswer = { 
      id: Date.now(), 
      text: answerText, 
      user: answererName, 
      upvotes: 0 
    };
    
    setAnswers(ans => [...ans, newAnswer]);
    
    // Create notification for question owner (if not the same user)
    if (mockQuestion.user !== answererName) {
      createAnswerNotification(mockQuestion.title, answererName, questionId);
    }
    
    // Parse and create notifications for mentions
    const mentions = parseMentions(answerText);
    const validMentions = validateMentions(mentions);
    
    validMentions.forEach(mentionedUser => {
      if (mentionedUser.toLowerCase() !== answererName.toLowerCase()) {
        createMentionNotification(mentionedUser, answererName, questionId);
      }
    });
    
    setAnswerText("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#23272a] py-8 px-2">
      <div className="bg-[#313338] p-4 sm:p-8 rounded-xl shadow-lg w-full max-w-2xl">
        {/* Breadcrumbs */}
        <div className="text-xs text-[#b5bac1] mb-4 flex items-center gap-2">
          <button onClick={() => router.push("/")} className="hover:underline">Home</button>
          <span className="mx-1">/</span>
          <span className="truncate max-w-[200px] sm:max-w-xs">{mockQuestion.title.slice(0, 40)}{mockQuestion.title.length > 40 ? "..." : ""}</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{mockQuestion.title}</h2>
        <div className="text-[#b5bac1] mb-2">{mockQuestion.description}</div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {mockQuestion.tags.map((tag, idx) => (
            <span key={idx} className="bg-[#40444b] text-xs px-2 py-1 rounded-md text-[#b5bac1]">{tag}</span>
          ))}
        </div>
        <div className="text-xs text-[#b5bac1] mb-6">Asked by {mockQuestion.user}</div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Answers ({answers.length})</h3>
          {answers.length === 0 && (
            <div className="text-[#b5bac1] text-center py-4">No answers yet. Be the first to answer!</div>
          )}
          {answers.map(a => (
            <div key={a.id} className="bg-[#40444b] rounded-lg p-4 mb-3 flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="text-white mb-2 sm:mb-0 w-full break-words">
                <div>{a.text}</div>
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <span className="text-[#b5bac1] text-xs">by {a.user}</span>
                <button
                  className={`ml-4 px-3 py-1 rounded bg-[#5865f2] text-white font-bold disabled:bg-[#23272a] disabled:text-[#b5bac1]`}
                  onClick={() => handleUpvote(a.id)}
                  disabled={!user || !!upvoted[a.id]}
                  title={!user ? "Login to upvote" : upvoted[a.id] ? "Already upvoted" : "Upvote"}
                >
                  ▲ {a.upvotes}
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Answer Form */}
        {user ? (
          <form onSubmit={handleAnswer} className="flex flex-col gap-2">
            <div className="text-sm text-[#b5bac1] mb-2">
              Tip: Use @username to mention other users (e.g., @alice, @bob)
            </div>
            <div data-color-mode="dark">
              <MDEditor
                value={answerText}
                onChange={(value) => setAnswerText(value || "")}
                height={100}
                preview="edit"
                className="rounded"
              />
            </div>
            <button type="submit" className="bg-[#5865f2] text-white py-2 rounded font-semibold hover:bg-[#4752c4] transition self-end">Submit Answer</button>
          </form>
        ) : (
          <div className="text-[#b5bac1] text-center py-4">Please <button className="text-[#5865f2] underline" onClick={() => router.push("/login")}>login</button> to submit an answer or upvote.</div>
        )}
      </div>
    </div>
  );
} 
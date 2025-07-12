"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useNotification } from "../../components/NotificationContext";
import { useAuth } from "../../components/AuthContext";
import { parseMentions, validateMentions } from "../../utils/mentions";
import Header from "../../components/Header";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const mockQuestion = {
  id: "1",
  title: "How to join 2 columns in a data set to make a separate column in SQL",
  description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine them into a full name column. I'm using MySQL if that helps.",
  tags: ["SQL", "Join", "Beginner", "MySQL"],
  user: "User Name",
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  upvotes: 12,
  downvotes: 2,
  answers: [
    { 
      id: 1, 
      text: "You can use the CONCAT function in SQL to combine columns. Here's the syntax:\n\n```sql\nSELECT CONCAT(first_name, ' ', last_name) AS full_name\nFROM your_table;\n```\n\nThis will create a new column called 'full_name' that combines the first_name and last_name columns with a space between them.", 
      user: "Alice", 
      upvotes: 8,
      downvotes: 1,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1) // 1 hour ago
    },
    { 
      id: 2, 
      text: "Alternatively, you can use the concatenation operator (||) in some SQL dialects:\n\n```sql\nSELECT first_name || ' ' || last_name AS full_name\nFROM your_table;\n```\n\nNote: The || operator works in PostgreSQL and SQLite, but not in MySQL. For MySQL, stick with CONCAT().", 
      user: "Bob", 
      upvotes: 5,
      downvotes: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    { 
      id: 3, 
      text: "If you want to handle NULL values, you can use CONCAT_WS which automatically handles separators:\n\n```sql\nSELECT CONCAT_WS(' ', first_name, last_name) AS full_name\nFROM your_table;\n```\n\nThis will skip any NULL values and only add the separator between non-NULL values.", 
      user: "Charlie", 
      upvotes: 3,
      downvotes: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
    },
  ],
};

type VoteState = 'upvote' | 'downvote' | null;

export default function QuestionDetailPage() {
  const [question, setQuestion] = useState(mockQuestion);
  const [answers, setAnswers] = useState(mockQuestion.answers);
  const [answerText, setAnswerText] = useState("");
  const [questionVote, setQuestionVote] = useState<VoteState>(null);
  const [answerVotes, setAnswerVotes] = useState<{ [key: number]: VoteState }>({});
  const { createAnswerNotification, createMentionNotification } = useNotification();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const questionId = params.id as string;

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const handleQuestionVote = (voteType: 'upvote' | 'downvote') => {
    setQuestionVote(currentVote => {
      let newVote: VoteState;
      let upvoteChange = 0;
      let downvoteChange = 0;

      if (currentVote === voteType) {
        // Remove vote if clicking the same button
        newVote = null;
        if (voteType === 'upvote') upvoteChange = -1;
        else downvoteChange = -1;
      } else if (currentVote === null) {
        // Add new vote
        newVote = voteType;
        if (voteType === 'upvote') upvoteChange = 1;
        else downvoteChange = 1;
      } else {
        // Switch vote (from upvote to downvote or vice versa)
        newVote = voteType;
        if (voteType === 'upvote') {
          upvoteChange = 1;
          downvoteChange = -1;
        } else {
          upvoteChange = -1;
          downvoteChange = 1;
        }
      }

      setQuestion(q => ({
        ...q,
        upvotes: q.upvotes + upvoteChange,
        downvotes: q.downvotes + downvoteChange
      }));

      return newVote;
    });
  };

  const handleAnswerVote = (answerId: number, voteType: 'upvote' | 'downvote') => {
    setAnswerVotes(currentVotes => {
      const currentVote = currentVotes[answerId];
      let newVote: VoteState;
      let upvoteChange = 0;
      let downvoteChange = 0;

      if (currentVote === voteType) {
        // Remove vote if clicking the same button
        newVote = null;
        if (voteType === 'upvote') upvoteChange = -1;
        else downvoteChange = -1;
      } else if (currentVote === null) {
        // Add new vote
        newVote = voteType;
        if (voteType === 'upvote') upvoteChange = 1;
        else downvoteChange = 1;
      } else {
        // Switch vote (from upvote to downvote or vice versa)
        newVote = voteType;
        if (voteType === 'upvote') {
          upvoteChange = 1;
          downvoteChange = -1;
        } else {
          upvoteChange = -1;
          downvoteChange = 1;
        }
      }

      setAnswers(ans => ans.map(a => 
        a.id === answerId 
          ? { ...a, upvotes: a.upvotes + upvoteChange, downvotes: a.downvotes + downvoteChange }
          : a
      ));

      return { ...currentVotes, [answerId]: newVote };
    });
  };

  const handleAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText) return;
    
    const answererName = user?.email.split("@")[0] || "Anonymous";
    const newAnswer = { 
      id: Date.now(), 
      text: answerText, 
      user: answererName, 
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date()
    };
    
    setAnswers(ans => [...ans, newAnswer]);
    
    // Create notification for question owner (if not the same user)
    if (question.user !== answererName) {
      createAnswerNotification(question.title, answererName, questionId);
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

  const handleTagClick = (tag: string) => {
    // Navigate to home page with the tag as a URL parameter
    router.push(`/?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="min-h-screen bg-[#23272a] flex flex-col">
      <Header />
      <div className="flex-1 py-8 px-2">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#313338] p-4 sm:p-8 rounded-xl shadow-lg">
            {/* Breadcrumbs */}
            <div className="text-xs text-[#b5bac1] mb-4 flex items-center gap-2">
              <button onClick={() => router.push("/")} className="hover:underline">Home</button>
              <span className="mx-1">/</span>
              <span className="truncate max-w-[200px] sm:max-w-xs">{question.title.slice(0, 40)}{question.title.length > 40 ? "..." : ""}</span>
            </div>
            
            {/* Question */}
            <div className="mb-8">
              <div className="flex gap-4">
                {/* Question Voting */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      questionVote === 'upvote'
                        ? "bg-[#5865f2] text-white" 
                        : "bg-[#313338] text-[#b5bac1] hover:bg-[#5865f2] hover:text-white"
                    }`}
                    onClick={() => handleQuestionVote('upvote')}
                    title="Upvote question"
                  >
                    <span className="material-symbols-outlined text-xl">arrow_upward</span>
                  </button>
                  <span className="text-white font-semibold text-lg">{question.upvotes - question.downvotes}</span>
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      questionVote === 'downvote'
                        ? "bg-[#f04747] text-white" 
                        : "bg-[#313338] text-[#b5bac1] hover:bg-[#f04747] hover:text-white"
                    }`}
                    onClick={() => handleQuestionVote('downvote')}
                    title="Downvote question"
                  >
                    <span className="material-symbols-outlined text-xl">arrow_downward</span>
                  </button>
                </div>
                
                {/* Question Content */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-3">{question.title}</h1>
                  <div className="text-[#b5bac1] mb-4 leading-relaxed">{question.description}</div>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {question.tags.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleTagClick(tag)}
                        className="bg-[#40444b] text-xs px-2 py-1 rounded-md text-[#b5bac1] hover:bg-[#5865f2] hover:text-white transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#b5bac1]">
                    <div className="flex items-center gap-4">
                      <span>Asked by {question.user}</span>
                      <span>{formatDate(question.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">thumb_up</span>
                        <span>{question.upvotes}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">thumb_down</span>
                        <span>{question.downvotes}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Answers */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Answers ({answers.length})</h2>
              {answers.length === 0 && (
                <div className="text-[#b5bac1] text-center py-8 bg-[#40444b] rounded-lg">
                  <div className="text-lg mb-2">No answers yet</div>
                  <div className="text-sm">Be the first to answer this question!</div>
                </div>
              )}
              {answers.map((a, index) => (
                <div key={a.id} className="bg-[#40444b] rounded-lg p-6 mb-4">
                  <div className="flex gap-4">
                    {/* Answer Voting */}
                    <div className="flex flex-col items-center gap-2">
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          answerVotes[a.id] === 'upvote'
                            ? "bg-[#5865f2] text-white" 
                            : "bg-[#313338] text-[#b5bac1] hover:bg-[#5865f2] hover:text-white"
                        }`}
                        onClick={() => handleAnswerVote(a.id, 'upvote')}
                        title="Upvote answer"
                      >
                        <span className="material-symbols-outlined text-xl">arrow_upward</span>
                      </button>
                      <span className="text-white font-semibold text-lg">{a.upvotes - a.downvotes}</span>
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          answerVotes[a.id] === 'downvote'
                            ? "bg-[#f04747] text-white" 
                            : "bg-[#313338] text-[#b5bac1] hover:bg-[#f04747] hover:text-white"
                        }`}
                        onClick={() => handleAnswerVote(a.id, 'downvote')}
                        title="Downvote answer"
                      >
                        <span className="material-symbols-outlined text-xl">arrow_downward</span>
                      </button>
                    </div>
                    
                    {/* Answer Content */}
                    <div className="flex-1">
                      <div className="text-white mb-4 leading-relaxed whitespace-pre-wrap">{a.text}</div>
                      <div className="flex items-center justify-between text-xs text-[#b5bac1]">
                        <div className="flex items-center gap-4">
                          <span>Answered by {a.user}</span>
                          <span>{formatDate(a.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          {index === 0 && (a.upvotes - a.downvotes) > 3 && (
                            <span className="bg-[#57f287] text-black px-2 py-1 rounded text-xs font-semibold">
                              ✓ Accepted
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">thumb_up</span>
                            <span>{a.upvotes}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">thumb_down</span>
                            <span>{a.downvotes}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Answer Form */}
            <div className="bg-[#40444b] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Your Answer</h3>
              <form onSubmit={handleAnswer} className="flex flex-col gap-4">
                <div className="text-sm text-[#b5bac1] p-3 bg-[#313338] rounded-lg">
                  <strong>Tip:</strong> Use @username to mention other users (e.g., @alice, @bob). You can also use markdown formatting.
                </div>
                <div data-color-mode="dark">
                  <MDEditor
                    value={answerText}
                    onChange={(value) => setAnswerText(value || "")}
                    height={150}
                    preview="edit"
                    className="rounded"
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-[#5865f2] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#4752c4] transition self-end"
                  disabled={!answerText.trim()}
                >
                  Post Answer
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
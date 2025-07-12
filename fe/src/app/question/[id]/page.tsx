"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { GET_QUESTION, GET_ANSWERS_BY_QUESTION, CREATE_ANSWER, GET_VOTE_STATS, CREATE_VOTE } from "../../../lib/graphql-queries";
import { useNotification } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { parseMentions, validateMentions } from "../../../utils/mentions";
import Header from "../../../components/Header";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useQuery as useApolloQuery } from "@apollo/client";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

// Helper component for answer voting stats
function AnswerVoteStats({ answerId, onRefetch }: { answerId: string; onRefetch?: (refetchFn: () => void) => void }) {
  const { data, loading, refetch } = useApolloQuery(GET_VOTE_STATS, { 
    variables: { answerId },
    fetchPolicy: 'cache-and-network'
  });
  
  // Register refetch function with parent only once
  const hasRegisteredRef = React.useRef(false);
  React.useEffect(() => {
    if (onRefetch && refetch && !hasRegisteredRef.current) {
      onRefetch(refetch);
      hasRegisteredRef.current = true;
    }
  }, [onRefetch, refetch]);
  
  let upvotes = 0, downvotes = 0;
  if (data?.voteStats) {
    try {
      const stats = JSON.parse(data.voteStats);
      upvotes = stats.upvotes;
      downvotes = stats.downvotes;
    } catch {}
  }
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-green-400 font-bold text-sm">▲ {upvotes}</span>
      <span className="text-red-400 font-bold text-sm">▼ {downvotes}</span>
    </div>
  );
}

export default function QuestionDetailPage() {
  const [answerText, setAnswerText] = useState("");
  const [upvoted, setUpvoted] = useState<{ [key: string]: boolean }>({});
  const [downvoted, setDownvoted] = useState<{ [key: string]: boolean }>({});
  const [voteStatsRefetch, setVoteStatsRefetch] = useState<{ [key: string]: () => void }>({});
  const { createAnswerNotification, createMentionNotification } = useNotification();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const questionId = params?.id as string;

  // Fetch question data
  const { data: questionData, loading: questionLoading, error: questionError } = useQuery(GET_QUESTION, {
    variables: { id: questionId },
    skip: !questionId,
  });

  // Fetch answers for this question
  const { data: answersData, loading: answersLoading, refetch: refetchAnswers } = useQuery(GET_ANSWERS_BY_QUESTION, {
    variables: { questionId },
    skip: !questionId,
  });

  // Create answer mutation
  const [createAnswer, { loading: creatingAnswer }] = useMutation(CREATE_ANSWER, {
    refetchQueries: [{ query: GET_ANSWERS_BY_QUESTION, variables: { questionId } }],
  });

  // Vote mutation
  const [createVote, { loading: voting }] = useMutation(CREATE_VOTE);

  const question = questionData?.question;
  const answers = answersData?.answersByQuestion || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const handleUpvote = async (answerId: string) => {
    if (!user) return;
    
    try {
      await createVote({
        variables: {
          createVoteInput: {
            answerId,
            voteType: 'UPVOTE'
          }
        }
      });
      
      // Toggle local state
      if (upvoted[answerId]) {
        setUpvoted(u => ({ ...u, [answerId]: false }));
      } else {
        setUpvoted(u => ({ ...u, [answerId]: true }));
        setDownvoted(d => ({ ...d, [answerId]: false }));
      }
      
      // Refetch vote stats
      if (voteStatsRefetch[answerId]) {
        voteStatsRefetch[answerId]();
      }
    } catch (error: any) {
      console.error("Error voting:", error);
    }
  };

  const handleDownvote = async (answerId: string) => {
    if (!user) return;
    
    try {
      await createVote({
        variables: {
          createVoteInput: {
            answerId,
            voteType: 'DOWNVOTE'
          }
        }
      });
      
      // Toggle local state
      if (downvoted[answerId]) {
        setDownvoted(d => ({ ...d, [answerId]: false }));
      } else {
        setDownvoted(d => ({ ...d, [answerId]: true }));
        setUpvoted(u => ({ ...u, [answerId]: false }));
      }
      
      // Refetch vote stats
      if (voteStatsRefetch[answerId]) {
        voteStatsRefetch[answerId]();
      }
    } catch (error: any) {
      console.error("Error voting:", error);
    }
  };

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText || !user) return;
    
    try {
      const { data } = await createAnswer({
        variables: {
          createAnswerInput: {
            content: answerText.trim(),
            questionId,
          },
        },
      });

      if (data?.createAnswer) {
        const answererName = user.email.split("@")[0];
        
        // Create notification for question owner (if not the same user)
        if (question?.author !== answererName) {
          createAnswerNotification(question?.title || "Question", answererName, questionId);
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
      }
    } catch (error: any) {
      console.error("Error creating answer:", error);
    }
  };

  if (questionLoading) {
    return (
      <div className="min-h-screen bg-[#23272a] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[#b5bac1] text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5865f2] mx-auto mb-4"></div>
            <div className="text-lg">Loading question...</div>
          </div>
        </div>
      </div>
    );
  }

  if (questionError || !question) {
    return (
      <div className="min-h-screen bg-[#23272a] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-400 text-center">
            <div className="text-lg mb-2">Question not found</div>
            <div className="text-sm">{questionError?.message}</div>
            <button 
              onClick={() => router.push("/")}
              className="mt-4 bg-[#5865f2] text-white py-2 px-4 rounded font-semibold hover:bg-[#4752c4] transition"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-white mb-3">{question.title}</h1>
              <div className="text-[#b5bac1] mb-4 leading-relaxed whitespace-pre-wrap">{question.desc}</div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {question.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-[#40444b] text-xs px-2 py-1 rounded-md text-[#b5bac1]">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-[#b5bac1]">
                <div className="flex items-center gap-4">
                  <span>Asked by {question.author}</span>
                  <span>{formatDate(question.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Answers */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Answers ({answers.length})</h2>
              {answersLoading ? (
                <div className="text-[#b5bac1] text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5865f2] mx-auto mb-2"></div>
                  <div className="text-sm">Loading answers...</div>
                </div>
              ) : answers.length === 0 ? (
                <div className="text-[#b5bac1] text-center py-8 bg-[#40444b] rounded-lg">
                  <div className="text-lg mb-2">No answers yet</div>
                  <div className="text-sm">Be the first to answer this question!</div>
                </div>
              ) : (
                answers.map((answer: any, index: number) => (
                  <div key={answer.id} className="bg-[#40444b] rounded-lg p-6 mb-4">
                    <div className="flex gap-4">
                      {/* Voting */}
                      <div className="flex flex-col items-center gap-2">
                        <button
                          className={`p-2 rounded-lg transition-colors ${
                            upvoted[answer.id] 
                              ? "bg-[#5865f2] text-white" 
                              : "bg-[#313338] text-[#b5bac1] hover:bg-[#5865f2] hover:text-white"
                          }`}
                          onClick={() => handleUpvote(answer.id)}
                          disabled={!user || voting}
                          title={!user ? "Login to upvote" : upvoted[answer.id] ? "Already upvoted" : "Upvote"}
                        >
                          <span className="material-symbols-outlined text-xl">arrow_upward</span>
                        </button>
                        {/* Upvotes/Downvotes */}
                        <AnswerVoteStats 
                          answerId={answer.id} 
                          onRefetch={(refetchFn) => {
                            setVoteStatsRefetch(prev => ({ ...prev, [answer.id]: refetchFn }));
                          }}
                        />
                        <button
                          className={`p-2 rounded-lg transition-colors ${
                            downvoted[answer.id] 
                              ? "bg-[#5865f2] text-white" 
                              : "bg-[#313338] text-[#b5bac1] hover:bg-[#5865f2] hover:text-white"
                          }`}
                          onClick={() => handleDownvote(answer.id)}
                          disabled={!user || voting}
                          title={!user ? "Login to downvote" : downvoted[answer.id] ? "Already downvoted" : "Downvote"}
                        >
                          <span className="material-symbols-outlined text-xl">arrow_downward</span>
                        </button>
                      </div>
                      {/* Answer Content */}
                      <div className="flex-1">
                        <div className="text-white mb-4 leading-relaxed whitespace-pre-wrap">{answer.content}</div>
                        <div className="flex items-center justify-between text-xs text-[#b5bac1]">
                          <div className="flex items-center gap-4">
                            <span>Answered by {answer.author}</span>
                            <span>{formatDate(answer.createdAt)}</span>
                          </div>
                          {index === 0 && (
                            <span className="bg-[#57f287] text-black px-2 py-1 rounded text-xs font-semibold">
                              ✓ Accepted
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Answer Form */}
            {user ? (
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
            ) : (
              <div className="text-[#b5bac1] text-center py-8 bg-[#40444b] rounded-lg">
                <div className="text-lg mb-2">Want to answer this question?</div>
                <div className="text-sm mb-4">Please login to submit an answer or upvote.</div>
                <button 
                  className="bg-[#5865f2] text-white py-2 px-4 rounded font-semibold hover:bg-[#4752c4] transition"
                  onClick={() => router.push("/login")}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

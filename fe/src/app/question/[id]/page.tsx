"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { GET_QUESTION, GET_ANSWERS_BY_QUESTION, CREATE_ANSWER, GET_VOTE_STATS, CREATE_VOTE, UPDATE_ANSWER, REMOVE_ANSWER } from "../../../lib/graphql-queries";
import { useNotification } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { parseMentions, validateMentions } from "../../../utils/mentions";
import Header from "../../../components/Header";
import dynamic from "next/dynamic";
import { ArrowUp, ArrowDown, MessageSquare, Clock, User, CheckCircle, Send, AlertCircle } from 'lucide-react';
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
    <div className="flex flex-col items-center gap-1 text-sm">
      <span className="text-success font-bold">▲ {upvotes}</span>
      <span className="text-error font-bold">▼ {downvotes}</span>
    </div>
  );
}

export default function QuestionDetailPage() {
  const [answerText, setAnswerText] = useState("");
  const [upvoted, setUpvoted] = useState<{ [key: string]: boolean }>({});
  const [downvoted, setDownvoted] = useState<{ [key: string]: boolean }>({});
  const [voteStatsRefetch, setVoteStatsRefetch] = useState<{ [key: string]: () => void }>({});
  const [acceptedAnswerId, setAcceptedAnswerId] = useState<string | null>(null);
  // State for editing answers
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editingAnswerText, setEditingAnswerText] = useState("");
  // Notifications are now backend-driven; remove createAnswerNotification, createMentionNotification
  const { user: currentUser } = useAuth();
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

  // Edit and delete answer mutations
  const [updateAnswer, { loading: updatingAnswer }] = useMutation(UPDATE_ANSWER, {
    refetchQueries: [{ query: GET_ANSWERS_BY_QUESTION, variables: { questionId } }],
  });
  const [removeAnswer, { loading: deletingAnswer }] = useMutation(REMOVE_ANSWER, {
    refetchQueries: [{ query: GET_ANSWERS_BY_QUESTION, variables: { questionId } }],
  });

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

  // Handle starting to edit an answer
  const handleStartEdit = (answer: any) => {
    setEditingAnswerId(answer.id);
    setEditingAnswerText(answer.content);
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingAnswerId(null);
    setEditingAnswerText("");
  };

  // Handle saving edited answer
  const handleSaveEdit = async (answerId: string) => {
    if (!editingAnswerText.trim()) return;
    
    try {
      await updateAnswer({
        variables: {
          id: answerId,
          updateAnswerInput: {
            content: editingAnswerText.trim()
          }
        }
      });
      
      setEditingAnswerId(null);
      setEditingAnswerText("");
    } catch (error: any) {
      console.error("Error updating answer:", error);
      alert("Failed to update answer. Please try again.");
    }
  };

  // Handle deleting an answer
  const handleDeleteAnswer = async (answerId: string) => {
    if (confirm('Are you sure you want to delete this answer?')) {
      try {
        await removeAnswer({ variables: { id: answerId } });
      } catch (error: any) {
        console.error("Error deleting answer:", error);
        alert('Failed to delete answer. Please try again.');
      }
    }
  };

  const handleUpvote = async (answerId: string) => {
    if (!currentUser) return;
    
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
    if (!currentUser) return;
    
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
    if (!answerText || !currentUser) return;
    
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
        const answererName = currentUser.email.split("@")[0];
        
        // Create notification for question owner (if not the same user)
        if (question?.author !== answererName) {
          // createAnswerNotification(question?.title || "Question", answererName, questionId);
        }
        
        // Parse and create notifications for mentions
        const mentions = parseMentions(answerText);
        const validMentions = validateMentions(mentions);
        
        validMentions.forEach(mentionedUser => {
          if (mentionedUser.toLowerCase() !== answererName.toLowerCase()) {
            // createMentionNotification(mentionedUser, answererName, questionId);
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
      <div className="min-h-screen bg-background-primary flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="spinner mx-auto mb-4" />
            <div className="text-foreground-secondary">Loading question...</div>
          </div>
        </div>
      </div>
    );
  }

  if (questionError || !question) {
    return (
      <div className="min-h-screen bg-background-primary flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
            <div className="text-lg text-foreground-primary mb-2">Question not found</div>
            <div className="text-sm text-foreground-secondary mb-4">{questionError?.message}</div>
            <button 
              onClick={() => router.push("/")}
              className="btn btn-primary hover-scale"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary flex flex-col">
      <Header />
      <div className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="card">
            {/* Breadcrumbs */}
            <div className="text-xs text-foreground-tertiary mb-6 flex items-center gap-2">
              <button onClick={() => router.push("/")} className="hover:text-foreground-primary transition-colors">Home</button>
              <span className="mx-1">/</span>
              <span className="truncate max-w-[200px] sm:max-w-xs">{question.title.slice(0, 40)}{question.title.length > 40 ? "..." : ""}</span>
            </div>
            
            {/* Question */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground-primary mb-4">{question.title}</h1>
              <div className="text-foreground-secondary mb-6 leading-relaxed whitespace-pre-wrap">{question.desc}</div>
              <div className="flex gap-2 mb-6 flex-wrap">
                {question.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="badge badge-primary">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-foreground-tertiary">
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Asked by {question.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(question.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Answers */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground-primary mb-6 flex items-center space-x-2">
                <MessageSquare className="w-6 h-6" />
                <span>Answers ({answers.length})</span>
              </h2>
              {answersLoading ? (
                <div className="text-center py-8">
                  <div className="spinner mx-auto mb-4" />
                  <div className="text-foreground-secondary">Loading answers...</div>
                </div>
              ) : answers.length === 0 ? (
                <div className="text-center py-12 bg-background-tertiary rounded-lg">
                  <MessageSquare className="w-12 h-12 text-foreground-tertiary mx-auto mb-4" />
                  <div className="text-lg text-foreground-primary mb-2">No answers yet</div>
                  <div className="text-foreground-secondary">Be the first to answer this question!</div>
                </div>
              ) : (
                answers.map((answer: any, index: number) => (
                  <div key={answer.id} className="card mb-6 hover-lift">
                    <div className="flex gap-6">
                      {/* Voting */}
                      <div className="flex flex-col items-center gap-3">
                        <button
                          className={`p-2 rounded-lg transition-all duration-200 hover-scale ${
                            upvoted[answer.id] 
                              ? "bg-accent-primary text-white shadow-lg" 
                              : "bg-background-tertiary text-foreground-tertiary hover:bg-accent-primary hover:text-white"
                          }`}
                          onClick={() => handleUpvote(answer.id)}
                          disabled={!currentUser || voting}
                          title={!currentUser ? "Login to upvote" : upvoted[answer.id] ? "Already upvoted" : "Upvote"}
                        >
                          <ArrowUp className="w-5 h-5" />
                        </button>
                        {/* Upvotes/Downvotes */}
                        <AnswerVoteStats 
                          answerId={answer.id} 
                          onRefetch={(refetchFn) => {
                            setVoteStatsRefetch(prev => ({ ...prev, [answer.id]: refetchFn }));
                          }}
                        />
                        <button
                          className={`p-2 rounded-lg transition-all duration-200 hover-scale ${
                            downvoted[answer.id] 
                              ? "bg-accent-primary text-white shadow-lg" 
                              : "bg-background-tertiary text-foreground-tertiary hover:bg-accent-primary hover:text-white"
                          }`}
                          onClick={() => handleDownvote(answer.id)}
                          disabled={!currentUser || voting}
                          title={!currentUser ? "Login to downvote" : downvoted[answer.id] ? "Already downvoted" : "Downvote"}
                        >
                          <ArrowDown className="w-5 h-5" />
                        </button>
                      </div>
                      {/* Answer Content */}
                      <div className="flex-1">
                        {editingAnswerId === answer.id ? (
                          <div className="mb-4">
                            <div data-color-mode="dark">
                              <MDEditor
                                value={editingAnswerText}
                                onChange={(value) => setEditingAnswerText(value || "")}
                                height={200}
                                preview="edit"
                                className="rounded-lg"
                              />
                            </div>
                            {/* Edit buttons */}
                            <div className="flex gap-2 mt-4">
                              <button
                                className="btn btn-xs btn-success"
                                onClick={() => handleSaveEdit(answer.id)}
                                disabled={updatingAnswer}
                              >
                                {updatingAnswer ? "Saving..." : "Save"}
                              </button>
                              <button
                                className="btn btn-xs btn-error"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-foreground-primary mb-4 leading-relaxed whitespace-pre-wrap">
                            {answer.content}
                          </div>
                        )}
                        
                        {/* Accepted badge or mark button */}
                        {question && currentUser && (currentUser.name === question.author || currentUser.email === question.author) && (
                          acceptedAnswerId === answer.id ? (
                            <div className="flex items-center space-x-1 badge badge-success mb-4">
                              <CheckCircle className="w-4 h-4" />
                              <span>accepted</span>
                            </div>
                          ) : (
                            <button
                              className="mb-4 p-1 rounded-full bg-background-tertiary hover:bg-success/20 transition-colors"
                              title="Mark as accepted"
                              onClick={e => { e.stopPropagation(); setAcceptedAnswerId(answer.id); }}
                            >
                              <CheckCircle className="w-4 h-4 text-foreground-tertiary hover:text-success" />
                            </button>
                          )
                        )}
                        
                        {/* Edit/Delete menu for answer owner */}
                        {currentUser && currentUser.name === answer.author && editingAnswerId !== answer.id && (
                          <div className="flex gap-2 mb-4">
                            <button
                              className="btn btn-xs btn-secondary"
                              title="Edit Answer"
                              onClick={() => handleStartEdit(answer)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-xs btn-error"
                              title="Delete Answer"
                              onClick={() => handleDeleteAnswer(answer.id)}
                              disabled={deletingAnswer}
                            >
                              {deletingAnswer ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-foreground-tertiary">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>Answered by {answer.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(answer.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Answer Form */}
            {currentUser ? (
              <div className="card">
                <h3 className="text-xl font-semibold text-foreground-primary mb-6">Your Answer</h3>
                <form onSubmit={handleAnswer} className="space-y-6">
                  <div className="p-4 bg-accent-tertiary rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-foreground-secondary">
                      <AlertCircle className="w-4 h-4" />
                      <span>Tip: Use @username to mention other users (e.g., @alice, @bob). You can also use markdown formatting.</span>
                    </div>
                  </div>
                  <div data-color-mode="dark">
                    <MDEditor
                      value={answerText}
                      onChange={(value) => setAnswerText(value || "")}
                      height={200}
                      preview="edit"
                      className="rounded-lg"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary hover-scale flex items-center space-x-2"
                    disabled={!answerText.trim() || creatingAnswer}
                  >
                    {creatingAnswer ? (
                      <>
                        <div className="spinner" />
                        <span>Posting Answer...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Post Answer</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="card text-center">
                <MessageSquare className="w-12 h-12 text-foreground-tertiary mx-auto mb-4" />
                <div className="text-lg text-foreground-primary mb-2">Want to answer this question?</div>
                <div className="text-foreground-secondary mb-6">Please login to submit an answer or upvote.</div>
                <button 
                  className="btn btn-primary hover-scale"
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

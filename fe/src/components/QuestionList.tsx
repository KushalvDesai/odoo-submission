"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useApolloClient, useMutation } from "@apollo/client";
import { GET_QUESTIONS, GET_ANSWERS_BY_QUESTION, GET_VOTE_STATS, UPDATE_QUESTION, REMOVE_QUESTION } from "../lib/graphql-queries";
import QuestionCard from "./QuestionCard";
import { Filter, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
};

type QuestionListProps = {
  filter: string;
  search: string;
  selectedTags?: string[];
  onTagClick?: (tag: string) => void;
  onClearTags?: () => void;
};

const PAGE_SIZE = 4;

const filterQuestions = (questions: Question[], filter: string, search: string, selectedTags?: string[]) => {
  let filtered = questions;
  
  // Filter by search term
  if (search) {
    filtered = filtered.filter(q => 
      q.title.toLowerCase().includes(search.toLowerCase()) || 
      q.desc.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Filter by tags
  if (selectedTags && selectedTags.length > 0) {
    filtered = filtered.filter(q => selectedTags.every(tag => q.tags.includes(tag)));
  }
  
  // Sort by filter
  switch (filter) {
    case "Newest":
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "Oldest":
      filtered = [...filtered].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case "Alphabetical":
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      // Default to newest
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  return filtered;
};

export default function QuestionList({ filter, search, selectedTags = [], onTagClick, onClearTags }: QuestionListProps) {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery(GET_QUESTIONS);
  const client = useApolloClient();
  const [questionStats, setQuestionStats] = useState<Record<string, { answers: number; upvotes: number; downvotes: number }>>({});
  const { user: currentUser } = useAuth();
  const router = useRouter();

  // Edit and delete mutations
  const [updateQuestion] = useMutation(UPDATE_QUESTION, {
    refetchQueries: [{ query: GET_QUESTIONS }],
  });
  const [removeQuestion] = useMutation(REMOVE_QUESTION, {
    refetchQueries: [{ query: GET_QUESTIONS }],
  });

  useEffect(() => {
    async function fetchStats() {
      if (!data?.questions) return;
      const stats: Record<string, { answers: number; upvotes: number; downvotes: number }> = {};
      for (const q of data.questions) {
        // Fetch answers for this question
        const ansRes = await client.query({
          query: GET_ANSWERS_BY_QUESTION,
          variables: { questionId: q.id },
        });
        const answers = ansRes.data?.answersByQuestion || [];
        let upvotes = 0;
        let downvotes = 0;
        // For each answer, fetch vote stats
        for (const a of answers) {
          const voteRes = await client.query({
            query: GET_VOTE_STATS,
            variables: { answerId: a.id },
          });
          let statsObj = { upvotes: 0, downvotes: 0 };
          try {
            statsObj = JSON.parse(voteRes.data?.voteStats || '{}');
          } catch {}
          upvotes += statsObj.upvotes || 0;
          downvotes += statsObj.downvotes || 0;
        }
        stats[q.id] = { answers: answers.length, upvotes, downvotes };
      }
      setQuestionStats(stats);
    }
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [filter, search, selectedTags]);

  // Handle question edit
  const handleEditQuestion = (questionId: string) => {
    // Navigate to edit page or open edit modal
    router.push(`/question/${questionId}/edit`);
  };

  // Handle question delete
  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      try {
        await removeQuestion({ variables: { id: questionId } });
      } catch (error: any) {
        console.error("Error deleting question:", error);
        alert('Failed to delete question. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-2 mt-6">
        <div className="text-center py-12 animate-fade-in">
          <div className="spinner mx-auto mb-4" />
          <div className="text-foreground-secondary">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col gap-2 mt-6">
        <div className="text-center py-12 animate-fade-in">
          <div className="text-lg text-error mb-2">Error loading questions</div>
          <div className="text-sm text-foreground-secondary">{error.message}</div>
        </div>
      </div>
    );
  }

  const questions: Question[] = data?.questions || [];
  const filtered = filterQuestions(questions, filter, search, selectedTags);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full flex flex-col gap-2 mt-6">
      {/* Active Filters */}
      {selectedTags.length > 0 && onClearTags && (
        <div className="mb-6 p-4 bg-background-secondary rounded-lg border border-border-primary">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-foreground-tertiary" />
            <span className="text-sm font-medium text-foreground-primary">Active Filters:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {selectedTags.map((tag, index) => (
              <span key={index} className="badge badge-primary flex items-center gap-1">
                {tag}
                <button
                  className="ml-1 hover:text-error transition-colors"
                  onClick={() => onTagClick && onTagClick(tag)}
                  title="Remove tag"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              className="text-sm text-error underline hover:text-foreground-primary transition-colors"
              onClick={onClearTags}
            >
              Clear All
            </button>
          </div>
        </div>
      )}
      
      {/* No Results */}
      {filtered.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <Search className="w-12 h-12 text-foreground-tertiary mx-auto mb-4" />
          <div className="text-lg text-foreground-primary mb-2">No questions found</div>
          <div className="text-foreground-secondary">Try adjusting your search or filters</div>
        </div>
      )}
      
      {/* Questions List */}
      <div className="space-y-4">
        {paged.map((question, index) => {
          const stats = questionStats[question.id] || { answers: 0, upvotes: 0, downvotes: 0 };
          return (
            <div key={question.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <QuestionCard
                id={question.id}
                title={question.title}
                description={question.desc}
                tags={question.tags}
                user={question.author}
                answers={stats.answers}
                upvotes={stats.upvotes}
                downvotes={stats.downvotes}
                createdAt={new Date(question.createdAt)}
                onTagClick={onTagClick}
                currentUser={currentUser}
                onEdit={() => handleEditQuestion(question.id)}
                onDelete={() => handleDeleteQuestion(question.id)}
              />
            </div>
          );
        })}
      </div>
      
      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-secondary hover-scale disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
              let pageNum;
              if (pageCount <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= pageCount - 2) {
                pageNum = pageCount - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-scale ${
                    pageNum === page
                      ? "bg-accent-primary text-white shadow-lg"
                      : "bg-background-secondary text-foreground-primary hover:bg-background-tertiary"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setPage(p => Math.min(pageCount, p + 1))}
            disabled={page === pageCount}
            className="btn btn-secondary hover-scale disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Results Count */}
      {filtered.length > 0 && (
        <div className="text-center text-sm text-foreground-tertiary mt-6">
          Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} questions
        </div>
      )}
    </div>
  );
} 
"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import { GET_QUESTIONS, GET_ANSWERS_BY_QUESTION, GET_VOTE_STATS } from "../lib/graphql-queries";
import QuestionCard from "./QuestionCard";

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

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-2 mt-6">
        <div className="text-[#b5bac1] text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5865f2] mx-auto mb-4"></div>
          <div className="text-lg">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-col gap-2 mt-6">
        <div className="text-red-400 text-center py-8">
          <div className="text-lg mb-2">Error loading questions</div>
          <div className="text-sm">{error.message}</div>
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
      {selectedTags.length > 0 && onClearTags && (
        <div className="mb-2 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#b5bac1]">Filtering by tags:</span>
          {selectedTags.map((tag, index) => (
            <span key={index} className="bg-[#5865f2] text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              {tag}
              <button
                className="ml-1 hover:text-[#f04747] transition-colors"
                onClick={() => onTagClick && onTagClick(tag)}
                title="Remove tag"
              >
                ×
              </button>
            </span>
          ))}
          <button
            className="text-xs text-[#f04747] underline ml-2"
            onClick={onClearTags}
          >
            Clear All
          </button>
        </div>
      )}
      
      {filtered.length === 0 && (
        <div className="text-[#b5bac1] text-center py-8">
          <div className="text-lg mb-2">No questions found</div>
          <div className="text-sm">Try adjusting your search or filters</div>
        </div>
      )}
      
      {paged.map((question) => {
        const stats = questionStats[question.id] || { answers: 0, upvotes: 0, downvotes: 0 };
        return (
          <QuestionCard
            key={question.id}
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
          />
        );
      })}
      
      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-lg bg-[#40444b] text-white hover:bg-[#5865f2] disabled:bg-[#23272a] disabled:text-[#b5bac1] transition-colors"
          >
            Previous
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pageNum === page
                      ? "bg-[#5865f2] text-white"
                      : "bg-[#40444b] text-white hover:bg-[#313338]"
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
            className="px-3 py-2 rounded-lg bg-[#40444b] text-white hover:bg-[#5865f2] disabled:bg-[#23272a] disabled:text-[#b5bac1] transition-colors"
          >
            Next
          </button>
        </div>
      )}
      
      {/* Show total count */}
      {filtered.length > 0 && (
        <div className="text-center text-xs text-[#b5bac1] mt-4">
          Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} questions
        </div>
      )}
    </div>
  );
} 
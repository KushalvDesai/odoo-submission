"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useApolloClient, useMutation } from "@apollo/client";
import { GET_QUESTIONS, GET_ANSWERS_BY_QUESTION, GET_VOTE_STATS, REMOVE_QUESTION } from "../../lib/graphql-queries";
import QuestionCard from "../../components/QuestionCard";
import { Filter, X, ChevronLeft, ChevronRight, Search, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Header from "../../components/Header";
import TopBar from "../../components/TopBar";
import { filterQuestionsWithFuzzySearch } from "../../utils/fuzzy-search";

type Question = {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
};

const PAGE_SIZE = 4;

export default function AdminPanel() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("Newest");
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { data, loading, error } = useQuery(GET_QUESTIONS);
  const client = useApolloClient();
  const [questionStats, setQuestionStats] = useState<Record<string, { answers: number; upvotes: number; downvotes: number }>>({});
  const { user: currentUser } = useAuth();

  // Delete question mutation
  const [removeQuestion, { loading: removingQuestion }] = useMutation(REMOVE_QUESTION, {
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

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  // Handle question delete
  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm('Are you sure you want to delete this question? This will also delete all its answers.')) {
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
      <div className="min-h-screen bg-background-primary flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="spinner mx-auto mb-4" />
            <div className="text-foreground-secondary">Loading questions...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-primary flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="text-lg text-error mb-2">Error loading questions</div>
            <div className="text-sm text-foreground-secondary">{error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  const questions: Question[] = data?.questions || [];
  const filtered = filterQuestionsWithFuzzySearch(questions, filter, search, selectedTags);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background-primary">
      <Header />
      <TopBar filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} />
      
      <main className="flex-1 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-6xl px-4 py-8">
          
          {/* Admin Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-foreground-primary mb-2">Admin Panel</h1>
            <p className="text-foreground-secondary">Manage all questions in the system</p>
          </div>
          
          {/* Questions Section */}
          <div className="animate-slide-in">
            <div className="w-full flex flex-col gap-2 mt-6">
              {/* Active Filters */}
              {selectedTags.length > 0 && (
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
                          onClick={() => handleTagClick(tag)}
                          title="Remove tag"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <button
                      className="text-sm text-error underline hover:text-foreground-primary transition-colors"
                      onClick={clearAllTags}
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
                {paged.map((question: Question, index: number) => {
                  const stats = questionStats[question.id] || { answers: 0, upvotes: 0, downvotes: 0 };
                  return (
                    <div key={question.id} className="animate-fade-in relative" style={{ animationDelay: `${index * 0.1}s` }}>
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
                        onTagClick={handleTagClick}
                        currentUser={currentUser}
                        onEdit={() => {}}
                        onDelete={() => handleDeleteQuestion(question.id)}
                      />
                      {/* Admin Delete Button */}
                      <button
                        className="absolute top-4 right-4 btn btn-xs btn-error flex items-center gap-1 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(question.id);
                        }}
                        disabled={removingQuestion}
                        title="Delete Question (Admin)"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
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
                    className="btn btn-secondary btn-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-foreground-secondary">
                    Page {page} of {pageCount}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                    disabled={page === pageCount}
                    className="btn btn-secondary btn-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
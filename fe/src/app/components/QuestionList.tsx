"use client";
import React, { useState } from "react";
import QuestionCard from "./QuestionCard";

type Question = {
  title: string;
  description: string;
  tags: string[];
  user: string;
  answers: number;
  createdAt?: Date;
  upvotes?: number;
};

type QuestionListProps = {
  filter: string;
  search: string;
  selectedTags?: string[];
  onTagClick?: (tag: string) => void;
  onClearTags?: () => void;
};

const initialQuestions: Question[] = [
  {
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description:
      "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine ...",
    tags: ["SQL", "Join", "Beginner"],
    user: "User Name",
    answers: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    upvotes: 12
  },
  {
    title: "How to center a div in CSS?",
    description: "I want to center a div both vertically and horizontally. What is the best way to do this in modern CSS?",
    tags: ["CSS", "HTML", "Frontend"],
    user: "Alice",
    answers: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    upvotes: 3
  },
  {
    title: "What is a closure in JavaScript?",
    description: "Can someone explain closures in JavaScript with a simple example? I'm trying to understand the concept better.",
    tags: ["JavaScript", "Functions", "Closures"],
    user: "Bob",
    answers: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    upvotes: 8
  },
  {
    title: "How to use useEffect in React?",
    description: "I am new to React hooks. How does useEffect work and when should I use it? Looking for practical examples.",
    tags: ["React", "Hooks", "useEffect"],
    user: "Charlie",
    answers: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    upvotes: 5
  },
  {
    title: "Difference between let, var, and const?",
    description: "What are the differences between let, var, and const in JavaScript? When should I use each one?",
    tags: ["JavaScript", "Variables", "ES6"],
    user: "Dana",
    answers: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    upvotes: 15
  },
  {
    title: "How to make a REST API in Node.js?",
    description: "What are the steps to create a simple REST API using Node.js and Express? Need a step-by-step guide.",
    tags: ["Node.js", "API", "Express", "Backend"],
    user: "Eve",
    answers: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    upvotes: 7
  },
  {
    title: "How to deploy a Next.js app?",
    description: "What are the best practices for deploying a Next.js application? Looking for deployment options and tips.",
    tags: ["Next.js", "Deployment", "Vercel"],
    user: "Frank",
    answers: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    upvotes: 9
  },
  {
    title: "How to use Python's zip function?",
    description: "I am confused about how zip works in Python. Can someone provide an example with different data types?",
    tags: ["Python", "zip", "Iterables"],
    user: "Grace",
    answers: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    upvotes: 4
  },
  {
    title: "How to use async/await in JavaScript?",
    description: "What is the difference between async/await and promises? When should I use async/await?",
    tags: ["JavaScript", "Async", "Await", "Promises"],
    user: "Henry",
    answers: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    upvotes: 6
  },
  {
    title: "How to use map in JavaScript?",
    description: "How does the map function work in JavaScript arrays? Can someone show me practical examples?",
    tags: ["JavaScript", "Array", "Map", "Functional"],
    user: "Ivy",
    answers: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    upvotes: 11
  },
  {
    title: "How to implement authentication in React?",
    description: "I need to add user authentication to my React app. What's the best way to implement login/logout?",
    tags: ["React", "Authentication", "JWT", "Frontend"],
    user: "Jack",
    answers: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
    upvotes: 13
  },
  {
    title: "How to optimize images in Next.js?",
    description: "What are the best practices for optimizing images in Next.js? Should I use the Image component?",
    tags: ["Next.js", "Images", "Optimization", "Performance"],
    user: "Kate",
    answers: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    upvotes: 8
  }
];

const PAGE_SIZE = 4;

const filterQuestions = (questions: Question[], filter: string, search: string, selectedTags?: string[]) => {
  let filtered = questions;
  if (filter === "Unanswered") filtered = filtered.filter(q => q.answers === 0);
  if (filter === "Answered") filtered = filtered.filter(q => q.answers > 0);
  if (search) filtered = filtered.filter(q => q.title.toLowerCase().includes(search.toLowerCase()) || q.description.toLowerCase().includes(search.toLowerCase()));
  if (selectedTags && selectedTags.length > 0) {
    filtered = filtered.filter(q => selectedTags.every(tag => q.tags.includes(tag)));
  }
  if (filter === "MostAnswers") filtered = [...filtered].sort((a, b) => b.answers - a.answers);
  if (filter === "FewestAnswers") filtered = [...filtered].sort((a, b) => a.answers - b.answers);
  if (filter === "Oldest") filtered = [...filtered].sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  if (filter === "Alphabetical") filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  return filtered;
};

const QuestionList = ({ filter, search, selectedTags = [], onTagClick, onClearTags }: QuestionListProps) => {
  const [page, setPage] = useState(1);
  const [questions] = useState(initialQuestions);
  const filtered = filterQuestions(questions, filter, search, selectedTags);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setPage(1);
  }, [filter, search, selectedTags]);

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
      
      {paged.map((q, idx) => (
        <QuestionCard key={idx} {...q} onTagClick={onTagClick} />
      ))}
      
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
};

export default QuestionList; 
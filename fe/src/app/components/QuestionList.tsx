"use client";
import React, { useState } from "react";
import QuestionCard from "./QuestionCard";

const initialQuestions = [
  {
    title: "How to join 2 columns in a data set to make a separate column in SQL",
    description:
      "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine ...",
    tags: ["SQL", "Join", "Beginner"],
    user: "User Name",
    answers: 5,
  },
  {
    title: "How to center a div in CSS?",
    description: "I want to center a div both vertically and horizontally. What is the best way to do this in modern CSS?",
    tags: ["CSS", "HTML", "Frontend"],
    user: "Alice",
    answers: 3,
  },
  {
    title: "What is a closure in JavaScript?",
    description: "Can someone explain closures in JavaScript with a simple example?",
    tags: ["JavaScript", "Functions"],
    user: "Bob",
    answers: 2,
  },
  {
    title: "How to use useEffect in React?",
    description: "I am new to React hooks. How does useEffect work and when should I use it?",
    tags: ["React", "Hooks"],
    user: "Charlie",
    answers: 4,
  },
  {
    title: "Difference between let, var, and const?",
    description: "What are the differences between let, var, and const in JavaScript?",
    tags: ["JavaScript", "Variables"],
    user: "Dana",
    answers: 1,
  },
  {
    title: "How to make a REST API in Node.js?",
    description: "What are the steps to create a simple REST API using Node.js and Express?",
    tags: ["Node.js", "API", "Express"],
    user: "Eve",
    answers: 6,
  },
  {
    title: "How to deploy a Next.js app?",
    description: "What are the best practices for deploying a Next.js application?",
    tags: ["Next.js", "Deployment"],
    user: "Frank",
    answers: 2,
  },
];

const PAGE_SIZE = 3;

const filterQuestions = (questions, filter, search) => {
  let filtered = questions;
  if (filter === "Unanswered") filtered = filtered.filter(q => q.answers === 0);
  if (search) filtered = filtered.filter(q => q.title.toLowerCase().includes(search.toLowerCase()) || q.description.toLowerCase().includes(search.toLowerCase()));
  return filtered;
};

const QuestionList = ({ filter, search }) => {
  const [page, setPage] = useState(1);
  const [questions] = useState(initialQuestions);
  const filtered = filterQuestions(questions, filter, search);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full flex flex-col gap-2 mt-6">
      {paged.length === 0 && <div className="text-[#b5bac1] text-center py-8">No questions found.</div>}
      {paged.map((q, idx) => (
        <QuestionCard key={idx} {...q} />
      ))}
      {/* Dynamic Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 select-none">
          <span
            className={`px-2 py-1 text-lg cursor-pointer ${page === 1 ? "text-gray-600" : "text-gray-400"}`}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >&lt;</span>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map(num => (
            <span
              key={num}
              className={`px-3 py-1 rounded-md text-lg cursor-pointer ${num === page ? "bg-blue-600 text-white font-bold" : "bg-[#2c2f34] text-gray-300 hover:bg-[#40444b]"}`}
              onClick={() => setPage(num)}
            >
              {num}
            </span>
          ))}
          <span
            className={`px-2 py-1 text-lg cursor-pointer ${page === pageCount ? "text-gray-600" : "text-gray-400"}`}
            onClick={() => setPage(p => Math.min(pageCount, p + 1))}
          >&gt;</span>
        </div>
      )}
    </div>
  );
};

export default QuestionList; 
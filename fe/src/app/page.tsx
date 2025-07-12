"use client";
import React, { useState } from "react";
import Header from "./components/Header";
import TopBar from "./components/TopBar";
import QuestionList from "./components/QuestionList";

export default function Home() {
  const [filter, setFilter] = useState("Newest");
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  return (
    <div className="min-h-screen w-screen bg-[#23272a] flex flex-col">
      <Header />
      <TopBar filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} />
      <div className="flex-1 flex flex-col items-center overflow-y-auto px-2 sm:px-0">
        <div className="w-full max-w-4xl px-4 py-6">
          <QuestionList filter={filter} search={search} tagFilter={tagFilter} setTagFilter={setTagFilter} />
        </div>
      </div>
    </div>
  );
}

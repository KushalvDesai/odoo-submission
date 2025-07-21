"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import TopBar from "../components/TopBar";
import QuestionList from "../components/QuestionList";

export default function Home() {
  const [filter, setFilter] = useState("Newest");
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  return (
    <div className="min-h-screen bg-background-primary">
      <Header />
      <TopBar filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} />
      
      <main className="flex-1 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-6xl px-4 py-8">
          
          {/* Questions Section */}
          <div className="animate-slide-in">
            <QuestionList 
              filter={filter} 
              search={search} 
              selectedTags={selectedTags} 
              onTagClick={handleTagClick}
              onClearTags={clearAllTags}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

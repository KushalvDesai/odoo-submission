"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter } from 'lucide-react';

type TopBarProps = {
  filter: string;
  setFilter: (f: string) => void;
  search: string;
  setSearch: (s: string) => void;
};

const sortOptions = [
  { label: "Newest", value: "Newest" },
  { label: "Oldest", value: "Oldest" },
  { label: "Most Answers", value: "MostAnswers" },
  { label: "Fewest Answers", value: "FewestAnswers" },
  { label: "Answered", value: "Answered" },
  { label: "Unanswered", value: "Unanswered" },
  { label: "A-Z", value: "Alphabetical" },
];

const TopBar = ({ filter, setFilter, search, setSearch }: TopBarProps) => {
  const router = useRouter();
  
  return (
    <div className="w-full bg-background-secondary border-b border-border-primary px-4 sm:px-8 py-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left side - Ask button and filter */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            className="btn btn-primary hover-scale flex items-center space-x-2"
            onClick={() => router.push("/ask")}
          >
            <Plus className="w-4 h-4" />
            <span>Ask New Question</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-foreground-tertiary" />
            <div className="relative">
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="input pr-8 appearance-none cursor-pointer hover:border-border-secondary transition-colors"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground-tertiary" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Search */}
        <div className="relative w-full sm:w-auto max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
          <input
            type="text"
            placeholder={search ? "Fuzzy searching..." : "Search questions..."}
            className={`input pl-10 pr-4 w-full ${search ? 'border-accent-primary bg-accent-tertiary/10' : ''}`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            title={search ? "Using fuzzy search - results ranked by relevance" : "Search in title, description, tags, and author"}
          />
          {search && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <div className="flex items-center space-x-1 text-xs text-accent-primary">
                <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></div>
                <span className="hidden sm:inline">Smart Search</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar; 
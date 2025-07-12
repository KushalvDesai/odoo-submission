"use client";
import React from "react";
import { useRouter } from "next/navigation";

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
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#313338] px-4 sm:px-8 py-4 border-b border-[#23272a] rounded-none font-sans">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          className="bg-[#5865f2] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#4752c4] transition-colors shadow"
          onClick={() => router.push("/ask")}
        >
          Ask New Question
        </button>
        <div className="flex gap-2 items-center ml-2">
          <div className="relative">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="bg-[#40444b] text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5865f2] appearance-none pr-6"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#b5bac1]">▼</span>
          </div>
        </div>
      </div>
      <div className="flex items-center bg-[#40444b] rounded-md px-2 py-1 w-full sm:w-auto max-w-md">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none text-white px-2 py-1 w-full placeholder-gray-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="text-white text-lg cursor-pointer">🔍</span>
      </div>
    </div>
  );
};

export default TopBar; 
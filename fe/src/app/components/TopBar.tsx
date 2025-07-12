import React from "react";

const TopBar = () => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#313338] px-8 py-4 border-b border-[#23272a] rounded-none font-sans">
      <button className="bg-[#5865f2] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#4752c4] transition-colors mb-2 sm:mb-0 shadow">Ask New question</button>
      <div className="flex gap-2 items-center">
        <button className="bg-[#40444b] text-white px-3 py-1 rounded-md hover:bg-[#5865f2] hover:text-white transition-colors">Newest</button>
        <button className="bg-[#40444b] text-white px-3 py-1 rounded-md hover:bg-[#5865f2] hover:text-white transition-colors">Unanswered</button>
        <button className="bg-[#40444b] text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-[#5865f2] hover:text-white transition-colors">
          more <span className="text-xs">▼</span>
        </button>
      </div>
      <div className="flex items-center bg-[#40444b] rounded-md px-2 py-1 w-full sm:w-auto max-w-md">
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none text-white px-2 py-1 w-full placeholder-gray-400"
        />
        <span className="text-white text-lg cursor-pointer">🔍</span>
      </div>
    </div>
  );
};

export default TopBar; 
import React from "react";

const Pagination = () => {
  const pages = [1, 2, 3, 4, 5, 6, 7];
  const currentPage = 1;
  return (
    <div className="flex items-center justify-center gap-2 select-none">
      <span className="px-2 py-1 text-lg text-gray-400 cursor-pointer">&lt;</span>
      {pages.map((num) => (
        <span
          key={num}
          className={`px-3 py-1 rounded-md text-lg cursor-pointer ${
            num === currentPage
              ? "bg-blue-600 text-white font-bold"
              : "bg-[#2c2f34] text-gray-300 hover:bg-[#40444b]"
          }`}
        >
          {num}
        </span>
      ))}
      <span className="px-2 py-1 text-lg text-gray-400 cursor-pointer">&gt;</span>
    </div>
  );
};

export default Pagination; 
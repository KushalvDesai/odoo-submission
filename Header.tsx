import React from "react";

const Header = () => {
  return (
    <header className="w-full flex items-center justify-between bg-[#2b2d31] text-white px-8 py-4 shadow-md border-b border-[#23272a] font-sans">
      <div className="text-2xl font-bold tracking-wide">StackIt</div>
      <button className="bg-[#5865f2] border-none rounded-lg px-6 py-2 text-white font-semibold hover:bg-[#4752c4] transition-colors shadow">Login</button>
    </header>
  );
};

export default Header; 
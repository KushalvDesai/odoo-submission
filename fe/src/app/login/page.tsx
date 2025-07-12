"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    // Mock login: just redirect
    window.localStorage.setItem("stackit_jwt", "mocktoken");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#23272a]">
      <form onSubmit={handleLogin} className="bg-[#313338] p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white mb-2">Login to StackIt</h2>
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-2 rounded bg-[#40444b] text-white placeholder-[#b5bac1] outline-none"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 rounded bg-[#40444b] text-white placeholder-[#b5bac1] outline-none"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" className="bg-[#5865f2] text-white py-2 rounded font-semibold hover:bg-[#4752c4] transition">Login</button>
        <div className="text-[#b5bac1] text-sm text-center">
          Don&apos;t have an account? <Link href="/register" className="text-[#5865f2] hover:underline">Register</Link>
        </div>
      </form>
    </div>
  );
} 
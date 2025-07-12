"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirm) {
      setError("Please fill all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    // Mock register: just redirect
    window.localStorage.setItem("stackit_jwt", "mocktoken");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#23272a]">
      <form onSubmit={handleRegister} className="bg-[#313338] p-8 rounded-xl shadow-lg w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white mb-2">Register for StackIt</h2>
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
        <input
          type="password"
          placeholder="Confirm Password"
          className="px-4 py-2 rounded bg-[#40444b] text-white placeholder-[#b5bac1] outline-none"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" className="bg-[#5865f2] text-white py-2 rounded font-semibold hover:bg-[#4752c4] transition">Register</button>
        <div className="text-[#b5bac1] text-sm text-center">
          Already have an account? <Link href="/login" className="text-[#5865f2] hover:underline">Login</Link>
        </div>
      </form>
    </div>
  );
} 
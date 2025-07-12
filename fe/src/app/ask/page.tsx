"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function AskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }
    // Mock submit: just redirect
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#23272a]">
      <form onSubmit={handleSubmit} className="bg-[#313338] p-8 rounded-xl shadow-lg w-full max-w-lg flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white mb-2">Ask a Question</h2>
        <input
          type="text"
          placeholder="Title"
          className="px-4 py-2 rounded bg-[#40444b] text-white placeholder-[#b5bac1] outline-none"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <div className="w-full">
          <label className="text-white mb-1 block">Description</label>
          <div data-color-mode="dark">
            <MDEditor
              value={description}
              onChange={setDescription}
              height={150}
              preview="edit"
              className="rounded"
            />
          </div>
        </div>
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="px-4 py-2 rounded bg-[#40444b] text-white placeholder-[#b5bac1] outline-none"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" className="bg-[#5865f2] text-white py-2 rounded font-semibold hover:bg-[#4752c4] transition">Submit Question</button>
      </form>
    </div>
  );
} 
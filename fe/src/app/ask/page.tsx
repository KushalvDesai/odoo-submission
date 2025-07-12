"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CREATE_QUESTION, GET_QUESTIONS } from "../../lib/graphql-queries";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { parseMentions, validateMentions } from "../../utils/mentions";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function AskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { createMentionNotification } = useNotification();

  const [createQuestion] = useMutation(CREATE_QUESTION, {
    refetchQueries: [{ query: GET_QUESTIONS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }
    if (!user) {
      setError("Please login to ask a question.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Parse tags from comma-separated string
      const tagArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);

      // Create the question
      const { data } = await createQuestion({
        variables: {
          createQuestionInput: {
            title: title.trim(),
            desc: description.trim(),
            tags: tagArray,
          },
        },
      });

      if (data?.createQuestion) {
        // Parse mentions in the question description
        const mentions = parseMentions(description);
        const validMentions = validateMentions(mentions);
        const questionerName = user.email.split("@")[0];
        
        // Create notifications for mentioned users
        validMentions.forEach(mentionedUser => {
          if (mentionedUser.toLowerCase() !== questionerName.toLowerCase()) {
            createMentionNotification(mentionedUser, questionerName, data.createQuestion.id);
          }
        });

        // Redirect to the new question
        router.push(`/question/${data.createQuestion.id}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#23272a]">
        <div className="bg-[#313338] p-8 rounded-xl shadow-lg w-full max-w-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-[#b5bac1] mb-4">You need to be logged in to ask a question.</p>
          <button 
            onClick={() => router.push("/login")} 
            className="bg-[#5865f2] text-white py-2 px-6 rounded font-semibold hover:bg-[#4752c4] transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
          disabled={loading}
        />
        <div className="w-full">
          <label className="text-white mb-1 block">Description</label>
          <div className="text-sm text-[#b5bac1] mb-2">
            Tip: Use @username to mention other users (e.g., @alice, @bob)
          </div>
          <div data-color-mode="dark">
            <MDEditor
              value={description}
              onChange={(value) => setDescription(value || "")}
              height={150}
              preview="edit"
              className="rounded"
              readOnly={loading}
            />
          </div>
        </div>
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="px-4 py-2 rounded bg-[#40444b] text-white placeholder-[#b5bac1] outline-none"
          value={tags}
          onChange={e => setTags(e.target.value)}
          disabled={loading}
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button 
          type="submit" 
          className="bg-[#5865f2] text-white py-2 rounded font-semibold hover:bg-[#4752c4] transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !title.trim() || !description.trim()}
        >
          {loading ? "Creating Question..." : "Submit Question"}
        </button>
      </form>
    </div>
  );
}

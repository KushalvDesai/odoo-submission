"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { CREATE_QUESTION, GET_QUESTIONS } from "../../lib/graphql-queries";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { parseMentions, validateMentions } from "../../utils/mentions";
import dynamic from "next/dynamic";
import { HelpCircle, Tag, AlertCircle, Send } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Login Required</h1>
            <p className="text-foreground-secondary">You need to be logged in to ask a question.</p>
          </div>
          <div className="card text-center">
            <AlertCircle className="w-12 h-12 text-foreground-tertiary mx-auto mb-4" />
            <p className="text-foreground-secondary mb-6">Please sign in to continue asking questions.</p>
            <button 
              onClick={() => router.push("/login")} 
              className="btn btn-primary hover-scale"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary p-4">
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Ask a Question</h1>
          <p className="text-foreground-secondary">Share your knowledge and help others learn</p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground-primary mb-2">
                Question Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="What's your question?"
                className="input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground-primary mb-2">
                Description
              </label>
              <div className="mb-2 p-3 bg-accent-tertiary rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-foreground-secondary">
                  <HelpCircle className="w-4 h-4" />
                  <span>Tip: Use @username to mention other users (e.g., @alice, @bob)</span>
                </div>
              </div>
              <div data-color-mode="dark">
                <MDEditor
                  value={description}
                  onChange={(value) => setDescription(value || "")}
                  height={200}
                  preview="edit"
                  className="rounded-lg"
                  readOnly={loading}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-foreground-primary mb-2">
                Tags
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
                <input
                  id="tags"
                  type="text"
                  placeholder="javascript, react, typescript (comma separated)"
                  className="input pl-10"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="badge badge-error flex items-center space-x-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-full hover-scale"
              disabled={loading || !title.trim() || !description.trim()}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="spinner" />
                  <span>Creating Question...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Submit Question</span>
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

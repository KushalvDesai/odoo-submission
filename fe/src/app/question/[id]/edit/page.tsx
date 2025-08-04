"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { GET_QUESTION, UPDATE_QUESTION } from "../../../../lib/graphql-queries";
import { useAuth } from "../../../../contexts/AuthContext";
import Header from "../../../../components/Header";
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import QuillEditor from "../../../../components/QuillEditor";

export default function EditQuestionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const questionId = params?.id as string;

  // Fetch question data
  const { data: questionData, loading: questionLoading, error: questionError } = useQuery(GET_QUESTION, {
    variables: { id: questionId },
    skip: !questionId,
  });

  // Update question mutation
  const [updateQuestion, { loading: updating }] = useMutation(UPDATE_QUESTION);

  // Set form data when question loads
  useEffect(() => {
    if (questionData?.question) {
      const question = questionData.question;
      setTitle(question.title);
      setDescription(question.desc);
      setTags(question.tags);
    }
  }, [questionData]);

  // Check if user is the owner
  const isOwner = currentUser && questionData?.question && 
    (currentUser.name === questionData.question.author || currentUser.email === questionData.question.author);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !currentUser) return;

    try {
      await updateQuestion({
        variables: {
          id: questionId,
          updateQuestionInput: {
            title: title.trim(),
            desc: description.trim(),
            tags: tags
          }
        }
      });

      // Navigate back to the question
      router.push(`/question/${questionId}`);
    } catch (error: any) {
      console.error("Error updating question:", error);
      alert("Failed to update question. Please try again.");
    }
  };

  if (questionLoading) {
    return (
      <div className="min-h-screen bg-background-primary flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="spinner mx-auto mb-4" />
            <div className="text-foreground-secondary">Loading question...</div>
          </div>
        </div>
      </div>
    );
  }

  if (questionError || !questionData?.question) {
    return (
      <div className="min-h-screen bg-background-primary flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
            <div className="text-lg text-foreground-primary mb-2">Question not found</div>
            <div className="text-sm text-foreground-secondary mb-4">{questionError?.message}</div>
            <button 
              onClick={() => router.push("/")}
              className="btn btn-primary hover-scale"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-background-primary flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
            <div className="text-lg text-foreground-primary mb-2">Access Denied</div>
            <div className="text-sm text-foreground-secondary mb-4">You can only edit your own questions.</div>
            <button 
              onClick={() => router.push(`/question/${questionId}`)}
              className="btn btn-primary hover-scale"
            >
              Back to Question
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary flex flex-col">
      <Header />
      <div className="flex-1 py-8 px-4">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="card">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => router.push(`/question/${questionId}`)}
                className="btn btn-secondary hover-scale"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Question
              </button>
              <h1 className="text-2xl font-bold text-foreground-primary">Edit Question</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground-primary mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input w-full"
                  placeholder="Enter your question title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground-primary mb-2">
                  Description
                </label>
                <QuillEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe your question..."
                  minHeight={200}
                  maxHeight={500}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-foreground-primary mb-2">
                  Tags
                </label>
                <div className="space-y-3">
                  {/* Tag Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="input flex-1"
                      placeholder="Add a tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="btn btn-secondary"
                      disabled={!tagInput.trim()}
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Tags Display */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span key={index} className="badge badge-primary flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            className="ml-1 hover:text-error transition-colors"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button 
                  type="submit" 
                  className="btn btn-primary hover-scale flex items-center space-x-2"
                  disabled={!title.trim() || !description.trim() || updating}
                >
                  {updating ? (
                    <>
                      <div className="spinner" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Update Question</span>
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => router.push(`/question/${questionId}`)}
                  className="btn btn-secondary hover-scale"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
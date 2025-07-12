"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-foreground-secondary">Sign in to your StackIt account</p>
        </div>
        
        {/* Login Form */}
        <div className="card">
          {error && (
            <div className="badge badge-error mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full hover-scale"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="spinner" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </div>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-foreground-secondary text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/register")}
                className="text-accent-primary hover:text-accent-secondary font-medium transition-colors hover-scale inline-flex items-center space-x-1"
              >
                <span>Create one</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  email: string;
  avatarUrl?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  register: (email: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const email = window.localStorage.getItem("stackit_user_email");
    if (email) setUser({ email });
  }, []);

  const login = (email: string) => {
    window.localStorage.setItem("stackit_user_email", email);
    setUser({ email });
  };

  const logout = () => {
    window.localStorage.removeItem("stackit_user_email");
    setUser(null);
  };

  const register = (email: string) => {
    // For mock, just login
    login(email);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
} 
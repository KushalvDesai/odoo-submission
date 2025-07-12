'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, User, LogOut, Plus, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border-primary backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0 hover-scale">
              <h1 className="text-2xl font-bold gradient-text">StackIt</h1>
            </Link>
            
            <div className="hidden md:flex md:space-x-1">
              <Link 
                href="/" 
                className="nav-link hover-lift"
              >
                Questions
              </Link>
              <Link 
                href="/ask" 
                className="nav-link hover-lift"
              >
                Ask Question
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
              <input
                type="text"
                placeholder="Search questions..."
                className="input pl-10 pr-4 bg-background-secondary/50 border-border-primary/50 focus:border-accent-primary"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 rounded-full bg-background-secondary border border-border-primary hover:border-border-secondary transition-all duration-300 hover-lift hover-glow group">
                  <Bell className="w-5 h-5 text-foreground-secondary group-hover:text-foreground-primary transition-colors" />
                  {/* Notification badge */}
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-error animate-pulse"></span>
                </button>

                {/* User menu */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-background-secondary border border-border-primary hover:border-border-secondary transition-all duration-300 hover-lift">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground-primary hidden sm:block">
                      {user.name}
                    </span>
                  </div>
                  
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-foreground-secondary hover:text-foreground-primary px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover-lift hover:bg-background-secondary"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:block">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="nav-link hover-lift"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn btn-primary hover-scale"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

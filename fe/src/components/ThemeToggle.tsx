'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-background-secondary border border-border-primary hover:border-border-secondary transition-all duration-300 hover-lift hover-glow group"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'light' 
              ? 'text-foreground-primary opacity-100 rotate-0' 
              : 'text-foreground-tertiary opacity-0 -rotate-90'
          }`}
        />
        <Moon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark' 
              ? 'text-foreground-primary opacity-100 rotate-0' 
              : 'text-foreground-tertiary opacity-0 rotate-90'
          }`}
        />
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-accent-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />
    </button>
  );
};

export default ThemeToggle; 
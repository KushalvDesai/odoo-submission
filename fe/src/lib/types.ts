// TypeScript types based on GraphQL schema
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  content: string;
  author: string;
  questionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  id: string;
  answerId: string;
  userId: string;
  voteType: VoteType;
  createdAt: string;
  updatedAt: string;
}

export enum VoteType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE'
}

// Input types for mutations
export interface CreateQuestionInput {
  title: string;
  desc: string;
  tags: string[];
}

export interface UpdateQuestionInput {
  title?: string;
  desc?: string;
  tags?: string[];
}

export interface CreateAnswerInput {
  content: string;
  questionId: string;
}

export interface UpdateAnswerInput {
  content?: string;
}

export interface CreateVoteInput {
  answerId: string;
  voteType: VoteType;
}

// Auth types
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

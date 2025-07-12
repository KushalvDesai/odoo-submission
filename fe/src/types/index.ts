
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  reputation: number;
  createdAt: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  votes: number;
  answerCount: number;
  hasAcceptedAnswer: boolean;
  createdAt: string;
  updatedAt: string;
  author: User;
  userVote?: Vote;
}

export interface Answer {
  id: string;
  content: string;
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  author: User;
  questionId: string;
  userVote?: Vote;
}

export interface Vote {
  id: string;
  type: 'UP' | 'DOWN';
  userId: string;
  questionId?: string;
  answerId?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'ANSWER' | 'VOTE' | 'MENTION' | 'COMMENT';
  message: string;
  read: boolean;
  createdAt: string;
  userId: string;
  relatedQuestion?: Question;
  relatedAnswer?: Answer;
  actor?: User;
}

export interface Tag {
  name: string;
  count: number;
  description?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
}

export interface CreateQuestionInput {
  title: string;
  description: string;
  tags: string[];
}

export interface CreateAnswerInput {
  questionId: string;
  content: string;
}

export interface UpdateProfileInput {
  username?: string;
  email?: string;
  avatar?: string;
}

export interface SearchFilters {
  search?: string;
  sortBy?: 'newest' | 'votes' | 'answers' | 'active';
  filterBy?: 'all' | 'unanswered' | 'answered' | 'accepted';
  tags?: string[];
  limit?: number;
  offset?: number;
}

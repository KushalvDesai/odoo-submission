
import Link from 'next/link';
import { ChevronUp, ChevronDown, MessageSquare, Clock, User } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: {
    username: string;
    avatar?: string;
  };
  votes: number;
  answerCount: number;
  createdAt: string;
  hasAcceptedAnswer: boolean;
}

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800/70 transition-colors">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <div className="text-center">
            <div className="text-lg font-semibold text-white">{question.votes}</div>
            <div className="text-xs">votes</div>
          </div>
          
          <div className={`text-center ${question.hasAcceptedAnswer ? 'text-green-400' : ''}`}>
            <div className="text-lg font-semibold">{question.answerCount}</div>
            <div className="text-xs">answers</div>
          </div>
        </div>

        <div className="flex-1">
          <Link 
            href={`/question/${question.id}`}
            className="text-xl font-semibold text-blue-400 hover:text-blue-300 transition-colors block mb-2"
          >
            {question.title}
          </Link>

          <div 
            className="text-slate-300 mb-3 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: question.description.substring(0, 150) + '...' }}
          />

          <div className="flex flex-wrap gap-2 mb-3">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-300 hover:bg-slate-600">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {question.createdAt}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {question.author.username}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

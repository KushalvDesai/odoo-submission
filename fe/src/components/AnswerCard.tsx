
import { ChevronUp, ChevronDown, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

interface Answer {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  userVote?: 'up' | 'down' | null;
}

interface AnswerCardProps {
  answer: Answer;
  isQuestionOwner: boolean;
  onVote: (answerId: string, type: 'up' | 'down') => void;
  onAccept: (answerId: string) => void;
}

export default function AnswerCard({ answer, isQuestionOwner, onVote, onAccept }: AnswerCardProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-lg p-6 ${answer.isAccepted ? 'border-green-500/50 bg-green-900/10' : ''}`}>
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVote(answer.id, 'up')}
            disabled={!isAuthenticated}
            className={`p-1 ${answer.userVote === 'up' ? 'text-green-400' : 'text-slate-400 hover:text-green-400'}`}
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
          
          <span className="text-lg font-semibold text-white">{answer.votes}</span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVote(answer.id, 'down')}
            disabled={!isAuthenticated}
            className={`p-1 ${answer.userVote === 'down' ? 'text-red-400' : 'text-slate-400 hover:text-red-400'}`}
          >
            <ChevronDown className="h-6 w-6" />
          </Button>

          {isQuestionOwner && !answer.isAccepted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAccept(answer.id)}
              className="p-1 text-slate-400 hover:text-green-400"
              title="Accept this answer"
            >
              <Check className="h-6 w-6" />
            </Button>
          )}

          {answer.isAccepted && (
            <div className="p-1 text-green-400" title="Accepted answer">
              <Check className="h-6 w-6" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div 
            className="prose prose-invert max-w-none mb-4"
            dangerouslySetInnerHTML={{ __html: answer.content }}
          />

          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span>answered {answer.createdAt}</span>
              <span>by {answer.author.username}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

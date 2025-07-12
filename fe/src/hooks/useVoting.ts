
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { VOTE_QUESTION, VOTE_ANSWER } from '../graphql/mutations';

type VoteType = 'UP' | 'DOWN';

interface VoteParams {
  type: VoteType;
  targetId: string;
  targetType: 'question' | 'answer';
}

export const useVoting = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [voteQuestionMutation] = useMutation(VOTE_QUESTION);
  const [voteAnswerMutation] = useMutation(VOTE_ANSWER);

  const vote = async ({ type, targetId, targetType }: VoteParams) => {
    setLoading(true);
    setError(null);

    try {
      let data;
      if (targetType === 'question') {
        const result = await voteQuestionMutation({
          variables: { questionId: targetId, type },
        });
        data = result.data?.voteQuestion;
      } else {
        const result = await voteAnswerMutation({
          variables: { answerId: targetId, type },
        });
        data = result.data?.voteAnswer;
      }

      setLoading(false);
      return data;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to vote');
      throw err;
    }
  };

  const voteQuestion = async (questionId: string, type: VoteType) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await voteQuestionMutation({
        variables: { questionId, type },
      });

      setLoading(false);
      return data.voteQuestion;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to vote');
      throw err;
    }
  };

  const voteAnswer = async (answerId: string, type: VoteType) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await voteAnswerMutation({
        variables: { answerId, type },
      });

      setLoading(false);
      return data.voteAnswer;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to vote');
      throw err;
    }
  };

  return {
    vote,
    voteQuestion,
    voteAnswer,
    loading,
    error,
  };
};

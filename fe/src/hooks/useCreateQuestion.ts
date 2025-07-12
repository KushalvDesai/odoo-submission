
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_QUESTION } from '../graphql/mutations';
import { GET_QUESTIONS } from '../graphql/queries';

interface CreateQuestionInput {
  title: string;
  description: string;
  tags: string[];
}

export const useCreateQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createQuestionMutation] = useMutation(CREATE_QUESTION, {
    refetchQueries: [{ query: GET_QUESTIONS }],
    errorPolicy: 'all',
  });

  const createQuestion = async (input: CreateQuestionInput): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await createQuestionMutation({
        variables: { input },
      });

      setLoading(false);
      return data.createQuestion.id;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to create question');
      throw err;
    }
  };

  return {
    createQuestion,
    loading,
    error,
  };
};

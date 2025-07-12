
import { useQuery } from '@apollo/client';
import { GET_QUESTION } from '../graphql/queries';

export const useQuestion = (questionId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_QUESTION, {
    variables: { id: questionId },
    errorPolicy: 'all',
    skip: !questionId,
  });

  return {
    question: data?.question,
    answers: data?.question?.answers || [],
    loading,
    error,
    refetch,
  };
};

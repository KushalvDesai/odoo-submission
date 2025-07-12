
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_QUESTIONS } from '../graphql/queries';

interface UseQuestionsOptions {
  search?: string;
  sortBy?: string;
  filterBy?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export const useQuestions = (options: UseQuestionsOptions = {}) => {
  const { data, loading, error, refetch, fetchMore } = useQuery(GET_QUESTIONS, {
    variables: {
      limit: options.limit || 20,
      offset: options.offset || 0,
      search: options.search,
      sortBy: options.sortBy || 'newest',
      filterBy: options.filterBy || 'all',
      tags: options.tags,
    },
    errorPolicy: 'all',
  });

  const loadMore = () => {
    if (data?.questions?.length) {
      fetchMore({
        variables: {
          offset: data.questions.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...prev,
            questions: [...prev.questions, ...fetchMoreResult.questions],
          };
        },
      });
    }
  };

  return {
    questions: data?.questions || [],
    loading,
    error,
    refetch,
    loadMore,
  };
};

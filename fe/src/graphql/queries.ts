import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

export const GET_QUESTIONS = gql`
  query GetQuestions {
    questions {
      id
      title
      desc
      tags
      author
      createdAt
      updatedAt
    }
  }
`;

export const GET_QUESTION = gql`
  query GetQuestion($id: String!) {
    question(id: $id) {
      id
      title
      desc
      tags
      author
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_ANSWERS = gql`
  query GetAllAnswers {
    answers {
      id
      content
      author
      questionId
      createdAt
      updatedAt
    }
  }
`;

export const GET_ANSWERS_BY_QUESTION = gql`
  query GetAnswersByQuestion($questionId: String!) {
    answersByQuestion(questionId: $questionId) {
      id
      content
      author
      questionId
      createdAt
      updatedAt
    }
  }
`;

export const GET_ANSWER = gql`
  query GetAnswer($id: String!) {
    answer(id: $id) {
      id
      content
      author
      questionId
      createdAt
      updatedAt
    }
  }
`;

export const GET_VOTES_BY_ANSWER = gql`
  query GetVotesByAnswer($answerId: String!) {
    votesByAnswer(answerId: $answerId) {
      id
      answerId
      userId
      voteType
      createdAt
      updatedAt
    }
  }
`;

export const GET_VOTES_BY_USER = gql`
  query GetVotesByUser($userId: String!) {
    votesByUser(userId: $userId) {
      id
      answerId
      userId
      voteType
      createdAt
      updatedAt
    }
  }
`;

export const GET_USER_VOTE = gql`
  query GetUserVote($answerId: String!) {
    userVote(answerId: $answerId) {
      id
      answerId
      userId
      voteType
      createdAt
      updatedAt
    }
  }
`;

export const GET_VOTE_STATS = gql`
  query GetVoteStats($answerId: String!) {
    voteStats(answerId: $answerId)
  }
`;

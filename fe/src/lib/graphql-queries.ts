import { gql } from '@apollo/client';

// AUTH QUERIES & MUTATIONS
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password)
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

// QUESTION QUERIES & MUTATIONS
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

export const CREATE_QUESTION = gql`
  mutation CreateQuestion($createQuestionInput: CreateQuestionDto!) {
    createQuestion(createQuestionInput: $createQuestionInput) {
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

export const UPDATE_QUESTION = gql`
  mutation UpdateQuestion($id: String!, $updateQuestionInput: UpdateQuestionDto!) {
    updateQuestion(id: $id, updateQuestionInput: $updateQuestionInput) {
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

export const DELETE_QUESTION = gql`
  mutation DeleteQuestion($id: String!) {
    removeQuestion(id: $id) {
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

// ANSWER QUERIES & MUTATIONS
export const GET_ANSWERS = gql`
  query GetAnswers {
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

export const CREATE_ANSWER = gql`
  mutation CreateAnswer($createAnswerInput: CreateAnswerDto!) {
    createAnswer(createAnswerInput: $createAnswerInput) {
      id
      content
      author
      questionId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_ANSWER = gql`
  mutation UpdateAnswer($id: String!, $updateAnswerInput: UpdateAnswerDto!) {
    updateAnswer(id: $id, updateAnswerInput: $updateAnswerInput) {
      id
      content
      author
      questionId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_ANSWER = gql`
  mutation DeleteAnswer($id: String!) {
    removeAnswer(id: $id) {
      id
      content
      author
      questionId
      createdAt
      updatedAt
    }
  }
`;

// VOTE QUERIES & MUTATIONS
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

export const CREATE_VOTE = gql`
  mutation CreateVote($createVoteInput: CreateVoteDto!) {
    vote(createVoteInput: $createVoteInput) {
      id
      answerId
      userId
      voteType
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_VOTE = gql`
  mutation DeleteVote($id: String!) {
    removeVote(id: $id) {
      id
      answerId
      userId
      voteType
    }
  }
`;

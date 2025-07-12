import { gql } from '@apollo/client';

// USER APIs
export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password)
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
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

// QUESTION APIs
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

export const REMOVE_QUESTION = gql`
  mutation RemoveQuestion($id: String!) {
    removeQuestion(id: $id)
  }
`;

// ANSWER APIs
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

export const REMOVE_ANSWER = gql`
  mutation RemoveAnswer($id: String!) {
    removeAnswer(id: $id)
  }
`;

// VOTE APIs
export const CREATE_VOTE = gql`
  mutation Vote($createVoteInput: CreateVoteDto!) {
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

export const REMOVE_VOTE = gql`
  mutation RemoveVote($id: String!) {
    removeVote(id: $id) {
      id
      answerId
      userId
      voteType
    }
  }
`;

// TAG APIs
export const CREATE_TAG = gql`
  mutation CreateTag($createTagInput: CreateTagDto!) {
    createTag(createTagInput: $createTagInput) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const GET_TAGS = gql`
  query GetTags {
    tags {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const GET_POPULAR_TAGS = gql`
  query GetPopularTags($limit: Int!) {
    popularTags(limit: $limit) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const SEARCH_TAGS = gql`
  query SearchTags($query: String!, $limit: Int!) {
    searchTags(query: $query, limit: $limit) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

// NOTIFICATION APIs
export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      id
      userId
      type
      message
      read
      meta
      createdAt
    }
  }
`;
// Add more notification mutations as needed (e.g., mark as read, create notification, etc.)

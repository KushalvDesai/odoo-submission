import { gql } from '@apollo/client';

export const REGISTER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password)
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
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

export const REMOVE_QUESTION = gql`
  mutation RemoveQuestion($id: String!) {
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

export const REMOVE_ANSWER = gql`
  mutation RemoveAnswer($id: String!) {
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

export const VOTE = gql`
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

export const REMOVE_VOTE = gql`
  mutation RemoveVote($id: String!) {
    removeVote(id: $id) {
      id
      answerId
      userId
      voteType
      createdAt
      updatedAt
    }
  }
`;

// Legacy mutations for backward compatibility
export const LOGIN_MUTATION = LOGIN;
export const SIGNUP_MUTATION = REGISTER;

// Notification mutations (placeholder - not in current schema)
export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: String!) {
    # This would need to be added to the schema
    markNotificationRead(id: $id)
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    # This would need to be added to the schema
    markAllNotificationsRead
  }
`;

// Voting mutations (using the current schema)
export const VOTE_QUESTION = VOTE; // Same vote mutation can be used
export const VOTE_ANSWER = VOTE; // Same vote mutation can be used

import { gql } from 'graphql-tag'

export const typeDefs = gql`
  # Indicates exactly one field must be supplied and this field must not be null.
  directive @oneOf on INPUT_OBJECT

  # A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format.
  scalar DateTime

  type Question {
    id: ID!
    title: String!
    desc: String!
    tags: [String!]!
    author: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Answer {
    id: ID!
    content: String!
    author: String!
    questionId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Vote {
    id: ID!
    answerId: String!
    userId: String!
    voteType: VoteType!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # The type of vote (upvote or downvote)
  enum VoteType {
    UPVOTE
    DOWNVOTE
  }

  type Query {
    questions: [Question!]!
    question(id: String!): Question!
    me: User
    answers: [Answer!]!
    answersByQuestion(questionId: String!): [Answer!]!
    answer(id: String!): Answer!
    votesByAnswer(answerId: String!): [Vote!]!
    votesByUser(userId: String!): [Vote!]!
    userVote(answerId: String!): Vote
    voteStats(answerId: String!): String!
  }

  type Mutation {
    createQuestion(createQuestionInput: CreateQuestionDto!): Question!
    updateQuestion(
      id: String!
      updateQuestionInput: UpdateQuestionDto!
    ): Question!
    removeQuestion(id: String!): Question!
    register(name: String!, email: String!, password: String!): String!
    login(email: String!, password: String!): String!
    createAnswer(createAnswerInput: CreateAnswerDto!): Answer!
    updateAnswer(id: String!, updateAnswerInput: UpdateAnswerDto!): Answer!
    removeAnswer(id: String!): Answer!
    vote(createVoteInput: CreateVoteDto!): Vote!
    removeVote(id: String!): Vote!
  }

  input CreateQuestionDto {
    title: String!
    desc: String!
    tags: [String!]
  }

  input UpdateQuestionDto {
    title: String
    desc: String
    tags: [String!]
  }

  input CreateAnswerDto {
    content: String!
    questionId: String!
  }

  input UpdateAnswerDto {
    content: String
  }

  input CreateVoteDto {
    answerId: String!
    voteType: VoteType!
  }
`

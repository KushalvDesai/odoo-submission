import { User, Question, Answer, Vote } from '@/lib/models'
import connectToDatabase from '@/lib/mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

// DateTime scalar type
const DateTimeType = new GraphQLScalarType({
  name: 'DateTime',
  serialize: (value: any) => {
    return value instanceof Date ? value.toISOString() : null
  },
  parseValue: (value: any) => {
    return new Date(value)
  },
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }
    return null
  }
})

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

// Context type
interface Context {
  user?: any
  req?: any
  res?: any
}

export const resolvers = {
  DateTime: DateTimeType,

  Query: {
    // User queries
    me: async (_: any, __: any, context: Context) => {
      await connectToDatabase()
      if (!context.user) return null
      return await User.findById(context.user.userId)
    },

    // Question queries
    questions: async () => {
      await connectToDatabase()
      return await Question.find().sort({ createdAt: -1 })
    },

    question: async (_: any, { id }: { id: string }) => {
      await connectToDatabase()
      return await Question.findById(id)
    },

    // Answer queries
    answers: async () => {
      await connectToDatabase()
      return await Answer.find().sort({ createdAt: -1 })
    },

    answersByQuestion: async (_: any, { questionId }: { questionId: string }) => {
      await connectToDatabase()
      return await Answer.find({ questionId }).sort({ createdAt: -1 })
    },

    answer: async (_: any, { id }: { id: string }) => {
      await connectToDatabase()
      return await Answer.findById(id)
    },

    // Vote queries
    votesByAnswer: async (_: any, { answerId }: { answerId: string }) => {
      await connectToDatabase()
      return await Vote.find({ answerId })
    },

    votesByUser: async (_: any, { userId }: { userId: string }) => {
      await connectToDatabase()
      return await Vote.find({ userId })
    },

    userVote: async (_: any, { answerId }: { answerId: string }, context: Context) => {
      await connectToDatabase()
      if (!context.user) return null
      return await Vote.findOne({ answerId, userId: context.user.userId })
    },

    voteStats: async (_: any, { answerId }: { answerId: string }) => {
      await connectToDatabase()
      const votes = await Vote.find({ answerId })
      const upvotes = votes.filter(vote => vote.voteType === 'UPVOTE').length
      const downvotes = votes.filter(vote => vote.voteType === 'DOWNVOTE').length
      return `${upvotes - downvotes}`
    }
  },

  Mutation: {
    // Authentication
    register: async (_: any, { name, email, password }: { name: string; email: string; password: string }) => {
      await connectToDatabase()
      
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        throw new Error('User already exists with this email')
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      
      const user = new User({
        name,
        email,
        password: hashedPassword
      })

      await user.save()
      
      const token = generateToken(user._id.toString())
      return token
    },

    login: async (_: any, { email, password }: { email: string; password: string }) => {
      await connectToDatabase()
      
      const user = await User.findOne({ email })
      if (!user) {
        throw new Error('Invalid email or password')
      }

      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        throw new Error('Invalid email or password')
      }

      const token = generateToken(user._id.toString())
      return token
    },

    // Question mutations
    createQuestion: async (_: any, { createQuestionInput }: { createQuestionInput: { title: string; desc: string; tags: string[] } }, context: Context) => {
      await connectToDatabase()
      if (!context.user) throw new Error('Not authenticated')

      const question = new Question({
        title: createQuestionInput.title,
        desc: createQuestionInput.desc,
        tags: createQuestionInput.tags,
        author: context.user.userId
      })

      await question.save()
      return question
    },

    updateQuestion: async (_: any, { id, updateQuestionInput }: { id: string; updateQuestionInput: { title?: string; desc?: string; tags?: string[] } }, context: Context) => {
      await connectToDatabase()
      if (!context.user) throw new Error('Not authenticated')

      const question = await Question.findById(id)
      if (!question) throw new Error('Question not found')
      if (question.author !== context.user.userId) throw new Error('Not authorized')

      const updatedQuestion = await Question.findByIdAndUpdate(
        id,
        { ...updateQuestionInput },
        { new: true }
      )
      return updatedQuestion
    },

    removeQuestion: async (_: any, { id }: { id: string }, context: Context) => {
      await connectToDatabase()
      if (!context.user) throw new Error('Not authenticated')

      const question = await Question.findById(id)
      if (!question) throw new Error('Question not found')
      if (question.author !== context.user.userId) throw new Error('Not authorized')

      await Question.findByIdAndDelete(id)
      return question
    },

    // Answer mutations
    createAnswer: async (_: any, { createAnswerInput }: { createAnswerInput: { content: string; questionId: string } }, context: Context) => {
      await connectToDatabase()
      if (!context.user) throw new Error('Not authenticated')

      const answer = new Answer({
        content: createAnswerInput.content,
        questionId: createAnswerInput.questionId,
        author: context.user.userId
      })

      await answer.save()
      return answer
    },

    updateAnswer: async (_: any, { id, updateAnswerInput }: { id: string; updateAnswerInput: { content?: string } }, context: Context) => {
      await connectToDatabase()
      if (!context.user) throw new Error('Not authenticated')

      const answer = await Answer.findById(id)
      if (!answer) throw new Error('Answer not found')
      if (answer.author !== context.user.userId) throw new Error('Not authorized')

      const updatedAnswer = await Answer.findByIdAndUpdate(
        id,
        { ...updateAnswerInput },
        { new: true }
      )
      return updatedAnswer
    },

    removeAnswer: async (_: any, { id }: { id: string }, context: Context) => {
      await connectToDatabase()
      if (!context.user) throw new Error('Not authenticated')

      const answer = await Answer.findById(id)
      if (!answer) throw new Error('Answer not found')
      if (answer.author !== context.user.userId) throw new Error('Not authorized')

      await Answer.findByIdAndDelete(id)
      return answer
    },

    // Vote mutations
    vote: async (_: any, { createVoteInput }: { createVoteInput: { answerId: string; voteType: 'UPVOTE' | 'DOWNVOTE' } }, context: Context) => {
      await connectToDatabase()
      if (!context.user) throw new Error('Not authenticated')

      const { answerId, voteType } = createVoteInput
      const userId = context.user.userId

      // Remove existing vote if any
      await Vote.findOneAndDelete({ answerId, userId })

      // Create new vote
      const vote = new Vote({
        answerId,
        userId,
        voteType
      })

      await vote.save()
      return vote
    },

    removeVote: async (_: any, { id }: { id: string }, context: Context) => {
      await connectToDatabase()
      if (!context.user) throw new Error('Not authenticated')

      const vote = await Vote.findById(id)
      if (!vote) throw new Error('Vote not found')
      if (vote.userId !== context.user.userId) throw new Error('Not authorized')

      await Vote.findByIdAndDelete(id)
      return vote
    }
  }
}

export default resolvers

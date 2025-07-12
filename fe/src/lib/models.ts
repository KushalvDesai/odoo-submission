import mongoose, { Schema, Document } from 'mongoose'

// User Model
export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
})

// Question Model
export interface IQuestion extends Document {
  _id: string
  title: string
  desc: string
  tags: string[]
  author: string // Changed to string to match schema
  createdAt: Date
  updatedAt: Date
}

const questionSchema = new Schema<IQuestion>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 150
  },
  desc: {
    type: String,
    required: true,
    minlength: 20
  },
  tags: [{
    type: String,
    required: true,
    trim: true,
    lowercase: true
  }],
  author: {
    type: String, // Changed to String to match schema
    required: true
  }
}, {
  timestamps: true
})

// Answer Model
export interface IAnswer extends Document {
  _id: string
  content: string
  author: string // Changed to string to match schema
  questionId: string // Changed to string to match schema
  createdAt: Date
  updatedAt: Date
}

const answerSchema = new Schema<IAnswer>({
  content: {
    type: String,
    required: true,
    minlength: 10
  },
  author: {
    type: String, // Changed to String to match schema
    required: true
  },
  questionId: {
    type: String, // Changed to String to match schema
    required: true
  }
}, {
  timestamps: true
})

// Vote Model (New model based on schema)
export interface IVote extends Document {
  _id: string
  answerId: string
  userId: string
  voteType: 'UPVOTE' | 'DOWNVOTE'
  createdAt: Date
  updatedAt: Date
}

const voteSchema = new Schema<IVote>({
  answerId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  voteType: {
    type: String,
    enum: ['UPVOTE', 'DOWNVOTE'],
    required: true
  }
}, {
  timestamps: true
})

// Add indexes for better performance
userSchema.index({ email: 1 }, { unique: true })
questionSchema.index({ author: 1 })
questionSchema.index({ tags: 1 })
questionSchema.index({ createdAt: -1 })
answerSchema.index({ questionId: 1 })
answerSchema.index({ author: 1 })
voteSchema.index({ answerId: 1 })
voteSchema.index({ userId: 1 })
voteSchema.index({ answerId: 1, userId: 1 }, { unique: true }) // Prevent duplicate votes

// Export models
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
export const Question = mongoose.models.Question || mongoose.model<IQuestion>('Question', questionSchema)
export const Answer = mongoose.models.Answer || mongoose.model<IAnswer>('Answer', answerSchema)
export const Vote = mongoose.models.Vote || mongoose.model<IVote>('Vote', voteSchema)

import { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/mongoose'
import { User, Question, Answer, Vote } from '@/lib/models'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await connectToDatabase()

    // Clear existing data
    await User.deleteMany({})
    await Question.deleteMany({})
    await Answer.deleteMany({})
    await Vote.deleteMany({})

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    const user1 = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword
    })
    await user1.save()

    const user2 = new User({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword
    })
    await user2.save()

    // Create sample questions
    const question1 = new Question({
      title: 'How to connect to MongoDB with Next.js?',
      desc: 'I am trying to connect my Next.js application to MongoDB but I am getting connection errors. Can someone help me with the proper setup?',
      tags: ['nextjs', 'mongodb', 'database'],
      author: user1._id.toString()
    })
    await question1.save()

    const question2 = new Question({
      title: 'What are the best practices for GraphQL schema design?',
      desc: 'I am designing a GraphQL schema for my application and want to know what are the industry best practices I should follow.',
      tags: ['graphql', 'schema', 'best-practices'],
      author: user2._id.toString()
    })
    await question2.save()

    const question3 = new Question({
      title: 'How to implement authentication in React?',
      desc: 'I need to implement user authentication in my React application. What are the different approaches and which one is recommended?',
      tags: ['react', 'authentication', 'security'],
      author: user1._id.toString()
    })
    await question3.save()

    // Create sample answers
    const answer1 = new Answer({
      content: 'You can use mongoose to connect to MongoDB. First install mongoose with npm install mongoose, then create a connection file with proper error handling.',
      author: user2._id.toString(),
      questionId: question1._id.toString()
    })
    await answer1.save()

    const answer2 = new Answer({
      content: 'For GraphQL schema design, follow these best practices: 1) Use descriptive names, 2) Keep the schema flat, 3) Use proper scalar types, 4) Implement proper error handling.',
      author: user1._id.toString(),
      questionId: question2._id.toString()
    })
    await answer2.save()

    // Create sample votes
    const vote1 = new Vote({
      answerId: answer1._id.toString(),
      userId: user1._id.toString(),
      voteType: 'UPVOTE'
    })
    await vote1.save()

    const vote2 = new Vote({
      answerId: answer2._id.toString(),
      userId: user2._id.toString(),
      voteType: 'UPVOTE'
    })
    await vote2.save()

    return res.status(200).json({
      message: 'Sample data created successfully',
      data: {
        users: 2,
        questions: 3,
        answers: 2,
        votes: 2
      }
    })
  } catch (error) {
    console.error('Error creating sample data:', error)
    return res.status(500).json({
      message: 'Error creating sample data',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

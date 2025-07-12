import { NextApiRequest, NextApiResponse } from 'next'
import { testConnection } from '@/lib/mongodb'
import connectToDatabase from '@/lib/mongoose'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Test MongoDB connection
    const mongoConnectionSuccess = await testConnection()
    
    // Test Mongoose connection
    await connectToDatabase()
    
    return res.status(200).json({
      message: 'Database connections successful',
      mongodb: mongoConnectionSuccess,
      mongoose: true,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return res.status(500).json({
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}

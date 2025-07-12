import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { typeDefs } from '@/graphql/schema'
import { resolvers } from '@/graphql/resolvers'
import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
})

// Create context function
const createContext = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  let user = null
  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      // Invalid token, user remains null
    }
  }

  return {
    user,
    req,
    res
  }
}

// Create the handler
const handler = startServerAndCreateNextHandler(server, {
  context: createContext
})

export default handler

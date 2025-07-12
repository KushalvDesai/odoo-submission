# StackIt - Q&A Platform

A full-stack Q&A platform with NestJS GraphQL backend and Next.js frontend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB URI (see [MongoDB Setup Guide](./MONGODB_SETUP.md))
- npm or yarn

### 1. Backend Setup (NestJS + GraphQL)

```bash
# Navigate to backend directory
cd be

# Install dependencies
npm install

# Set up environment variables
# The .env file is already created with default values:
# MONGODB_URI=mongodb://localhost:27017/stackit
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# PORT=3000

# Make sure MongoDB is running (see MONGODB_SETUP.md for instructions)

# Start the backend server
npm run start:dev
```

Backend will be available at:
- **GraphQL API**: http://localhost:3000/graphql
- **GraphQL Playground**: http://localhost:3000/graphql

### 2. Frontend Setup (Next.js + Apollo Client)

```bash
# Open a new terminal and navigate to frontend directory
cd fe

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

Frontend will be available at:
- **Web App**: http://localhost:3000

> **Note**: The frontend is configured to run on port 3001 to avoid conflicts with the backend on port 3000.

## 🏗️ Architecture

### Backend (be/)
- **Framework**: NestJS with GraphQL
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based auth
- **Features**: Users, Questions, Answers, Voting system

### Frontend (fe/)
- **Framework**: Next.js 15 with App Router
- **GraphQL Client**: Apollo Client
- **Styling**: Tailwind CSS
- **Features**: Full CRUD operations, authentication, responsive design

## 📋 Key Features

- ✅ **User Authentication** (Register/Login with JWT)
- ✅ **Question Management** (CRUD operations)
- ✅ **Answer System** (Post answers to questions)
- ✅ **Voting System** (Upvote/Downvote answers)
- ✅ **Tag System** (Organize and filter questions)
- ✅ **Search & Filter** (Find questions by keywords and tags)
- ✅ **Responsive Design** (Mobile-first approach)

## 🔧 Development

### Backend Development
```bash
cd be
npm run start:dev  # Start with hot reload
```

### Frontend Development
```bash
cd fe
npm run dev  # Start with hot reload
```

### Testing the Connection
1. Start the backend first
2. Start the frontend
3. Open http://localhost:3001
4. You should see a connection status indicator

## 📡 GraphQL Schema

The GraphQL schema includes:

- **User**: Authentication and user management
- **Question**: Question CRUD with tags
- **Answer**: Answer system linked to questions
- **Vote**: Voting system for answers

See the GraphQL Playground at http://localhost:3000/graphql for full schema documentation.

## 🚦 API Endpoints

### Authentication
```graphql
mutation Login {
  login(email: "user@example.com", password: "password")
}

mutation Register {
  register(name: "User", email: "user@example.com", password: "password")
}
```

### Questions
```graphql
query GetQuestions {
  questions {
    id
    title
    desc
    tags
    author
    createdAt
  }
}

mutation CreateQuestion {
  createQuestion(createQuestionInput: {
    title: "How to use GraphQL?"
    desc: "I want to learn GraphQL basics"
    tags: ["graphql", "api"]
  }) {
    id
    title
  }
}
```

## 🔍 Troubleshooting

### Backend Issues
- Ensure MongoDB is running
- Check .env file has correct MONGODB_URI
- Verify port 3000 is available

### Frontend Issues
- Ensure backend is running on http://localhost:3000
- Check browser console for GraphQL errors
- Verify port 3001 is available

### Connection Issues
- Backend must be started before frontend
- Check CORS settings if seeing network errors
- Verify GraphQL endpoint is accessible

## 📂 Project Structure

```
odoo-submission/
├── be/                 # Backend (NestJS + GraphQL)
│   ├── src/
│   │   ├── users/      # User authentication
│   │   ├── questions/  # Question management
│   │   ├── answers/    # Answer system
│   │   └── votes/      # Voting system
│   └── package.json
├── fe/                 # Frontend (Next.js + Apollo)
│   ├── src/
│   │   ├── app/        # Next.js pages
│   │   ├── components/ # React components
│   │   ├── contexts/   # React contexts
│   │   └── lib/        # GraphQL client & types
│   └── package.json
└── README.md
```

## 📄 License

This project is part of the StackIt Q&A platform submission.

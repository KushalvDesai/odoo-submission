
# StackIt - Full Stack Q&A Platform

<div align="center">

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

*A modern, feature-rich Q&A platform inspired by Stack Overflow*

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [API Documentation](#api-documentation) • [Contributing](#contributing)

</div>

## 🚀 Overview

StackIt is a comprehensive Q&A platform that enables developers and enthusiasts to ask questions, share knowledge, and build a community around learning. Built with modern web technologies, it offers real-time interactions, voting systems, and notification features.

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- ❓ **Question Management** - Create, edit, and manage questions with rich text support
- 💬 **Answer System** - Comprehensive answering with markdown support
- 🏷️ **Tag System** - Organize content with categorized tags
- 👍 **Voting System** - Upvote/downvote answers to highlight quality content
- 📢 **Real-time Notifications** - Stay updated with instant notifications
- 🔗 **User Mentions** - Tag users with @mentions in answers
- 📱 **Responsive Design** - Optimized for all device sizes
- 🔍 **Smart Searching** - Uses fuzzy searching to find the closest matching posts even with typos or partial queries
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS

## 🛠️ Tech Stack

### Backend (`/be`)
- **Framework**: [NestJS](https://nestjs.com/) v11.0.1
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose v8.16.3
- **API**: GraphQL with Apollo Server v13.1.0
- **Authentication**: JWT with Passport
- **Validation**: Class Validator & Class Transformer
- **Security**: bcryptjs for password hashing

### Frontend (`/fe`)
- **Framework**: [Next.js](https://nextjs.org/) v15.3.5
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Fonts**: Geist Sans & Geist Mono
- **React**: v19.0.0

### Development Tools
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, Supertest
- **Build**: SWC, TypeScript v5.7.3

## 📁 Project Structure

```
├── be/                          # Backend NestJS Application
│   ├── src/
│   │   ├── answers/            # Answer module (CRUD, GraphQL resolvers)
│   │   ├── auth/               # Authentication guards & decorators
│   │   ├── notifications/      # Notification system
│   │   ├── questions/          # Question module (CRUD, GraphQL resolvers)
│   │   ├── tags/              # Tag management system
│   │   ├── users/             # User management & authentication
│   │   ├── votes/             # Voting system for answers
│   │   ├── app.module.ts      # Main application module
│   │   └── main.ts           # Application entry point
│   └── test/                  # E2E test files
│
└── fe/                         # Frontend Next.js Application
    ├── src/
    │   └── app/               # Next.js App Router
    │       ├── layout.tsx     # Root layout component
    │       ├── page.tsx       # Home page
    │       └── globals.css    # Global styles
    └── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v6.0 or higher)
- **npm** or **yarn**

### 🔧 Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd be
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the `be` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/stackit-qa
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Server
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the development server:**
   ```bash
   npm run start:dev
   ```

5. **Verify installation:**
   - API: http://localhost:3000
   - GraphQL Playground: http://localhost:3000/graphql

### 🎨 Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env.local` file in the `fe` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/graphql
   NEXT_PUBLIC_APP_NAME=StackIt
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:3001
   - Ready for development! 🎉

## 📚 API Documentation

### GraphQL Schema

The backend exposes a GraphQL API with the following main types:

#### Core Entities
- **User**: User management and authentication
- **Question**: Question creation and management
- **Answer**: Answer system with rich content
- **Vote**: Voting system for answers
- **Tag**: Content categorization
- **Notification**: Real-time user notifications

#### Key Queries & Mutations



### GraphQL Playground

When running in development mode, access the interactive GraphQL Playground at:
`http://localhost:3000/graphql`

## 🧪 Testing

### Backend Tests
```bash
cd be

# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

### Frontend Tests
```bash
cd fe

# Run tests
npm run test

# Run linting
npm run lint
```

## 🔧 Development Commands

### Backend
```bash
# Development
npm run start:dev      # Start with hot reload
npm run start:debug    # Start with debugging

# Production
npm run build          # Build for production
npm run start:prod     # Start production build

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

### Frontend
```bash
# Development
npm run dev            # Start development server

# Production
npm run build          # Build for production
npm run start          # Start production build

# Code Quality
npm run lint           # Run Next.js linting
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style Guidelines

- Follow TypeScript best practices
- Use meaningful variable and function names
- Write comprehensive tests for new features
- Follow the existing project structure
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**StackIt Development Team**

| Role | Name | Email |
|------|------|-------|
| Team Lead (TL) | Yash Bharvada | kingisright67@gmail.com |
| Developer | Kushal Desai | kushal.desaiofficial@gmail.com |
| Developer | Shrey Lakhtaria | shreylakhtaria@gmail.com |
| Developer | Aaleya Boxwala | aaleya.boxwala@gmail.com |

**Repository Information**
- **Repository**: [stackit-1602](https://github.com/KushalvDesai/stackit-1602)
- **Owner**: [KushalvDesai](https://github.com/KushalvDesai)
- **Current Branch**: Shrey-BE

## 🙏 Acknowledgments

- Inspired by Stack Overflow's community-driven approach
- Built with amazing open-source technologies
- Thanks to all contributors and the developer community

---

<div align="center">

**[⬆ Back to Top](#stackit---full-stack-qa-platform)**

Made with ❤️ by the StackIt Team

</div>
=======

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
=======
# Stackit

## Team
1. Yash Bharvada (TL) kingisright67@gmail.com
2. Kushal Desai kushal.desaiofficial@gmail.com
3. Shrey Lakhtaria shreylakhtaria@gmail.com
4. Aaleya Boxwala aaleya.boxwala@gmail.com



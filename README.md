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

```graphql
# User Authentication
mutation register($input: RegisterInput!) {
  register(input: $input) {
    user { id, email, name }
    token
  }
}

# Question Management
query getQuestions($limit: Int, $offset: Int) {
  questions(limit: $limit, offset: $offset) {
    id, title, desc, tags, author, createdAt
  }
}

# Voting System
mutation vote($answerId: ID!, $voteType: VoteType!) {
  vote(answerId: $answerId, voteType: $voteType) {
    id, voteType, createdAt
  }
}
```

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

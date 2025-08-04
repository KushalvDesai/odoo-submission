
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

### GraphQL Playground

When running in development mode, access the interactive GraphQL Playground at:
`http://localhost:3000/graphql`

## 👥 Team

**StackIt Development Team**

| Role | Name | Email |
|------|------|-------|
| Team Lead (TL) | Yash Bharvada | kingisright67@gmail.com |
| Developer | Kushal Desai | kushal.desaiofficial@gmail.com |
| Developer | Shrey Lakhtaria | shreylakhtaria@gmail.com |
| Developer | Aaleya Boxwala | aaleya.boxwala@gmail.com |

## 📈 Project Statistics

<div align="center">

![Contributor Stats](https://contrib.rocks/image?repo=KushalvDesai/stackit-1602)

### **StackIt Repository Activity**
<img src="https://github-readme-stats.vercel.app/api/pin/?username=KushalvDesai&repo=stackit-1602&theme=tokyonight&hide_border=true&show_owner=true" alt="StackIt Repository" />

### **Repository Analytics**
![GitHub Repo Size](https://img.shields.io/github/repo-size/KushalvDesai/stackit-1602?style=flat-square&color=blue)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/KushalvDesai/stackit-1602?style=flat-square&color=green)
![GitHub last commit](https://img.shields.io/github/last-commit/KushalvDesai/stackit-1602?style=flat-square&color=orange)
![GitHub issues](https://img.shields.io/github/issues/KushalvDesai/stackit-1602?style=flat-square&color=red)
![GitHub pull requests](https://img.shields.io/github/issues-pr/KushalvDesai/stackit-1602?style=flat-square&color=yellow)
![GitHub contributors](https://img.shields.io/github/contributors/KushalvDesai/stackit-1602?style=flat-square&color=purple)
![GitHub forks](https://img.shields.io/github/forks/KushalvDesai/stackit-1602?style=flat-square&color=cyan)
![GitHub stars](https://img.shields.io/github/stars/KushalvDesai/stackit-1602?style=flat-square&color=gold)

### **Language Distribution in StackIt**
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=KushalvDesai&repo=stackit-1602&layout=compact&theme=tokyonight&hide_border=true" alt="StackIt Languages" />

</div>

## 🙏 Acknowledgments

- Inspired by Stack Overflow's community-driven approach
- Built with amazing open-source technologies
- Thanks to all contributors and the developer community

---

<div align="center">

**[⬆ Back to Top](#stackit---full-stack-qa-platform)**

Made with ❤️ by the StackIt Team

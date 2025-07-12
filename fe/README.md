# StackIt Frontend - Next.js Q&A Platform

A modern Q&A platform built with Next.js, Apollo Client, and GraphQL.

## 🚀 Features

- **User Authentication**: JWT-based login/register system
- **Question Management**: Create, view, search, and filter questions
- **Answer System**: Post and view answers with rich text support
- **Voting System**: Upvote/downvote answers with real-time vote counts
- **Tag System**: Organize questions with tags and filter by tags
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: GraphQL subscriptions for live updates

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **GraphQL Client**: Apollo Client
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── ask/               # Ask question page
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── question/[id]/     # Question detail page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (questions list)
├── components/            # Reusable components
│   ├── ApolloWrapper.tsx  # Apollo Client provider
│   ├── Navbar.tsx         # Navigation component
│   └── LoadingSpinner.tsx # Loading component
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
└── lib/                   # Utilities and configurations
    ├── apollo-client.ts   # Apollo Client setup
    ├── graphql-queries.ts # GraphQL queries and mutations
    └── types.ts           # TypeScript type definitions
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend GraphQL server running on port 3000

### Installation

1. **Install dependencies**:
   ```bash
   cd fe
   npm install
   ```

2. **Environment setup**:
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3000/graphql
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3001`

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🗺️ User Flow

### 1. Authentication
- **Register**: Create new account with name, email, password
- **Login**: Sign in with email and password
- **JWT Storage**: Tokens stored in localStorage
- **Auto-logout**: Redirect to login when token expires

### 2. Question Management
- **View Questions**: Browse all questions on home page
- **Search**: Filter questions by title/description
- **Tag Filter**: Filter by specific tags
- **Ask Question**: Create new questions (authenticated users only)

### 3. Question Detail & Answers
- **View Question**: See full question with tags and metadata
- **View Answers**: All answers with voting scores
- **Post Answer**: Add new answers (authenticated users only)
- **Voting**: Upvote/downvote answers with real-time updates

## 🔗 GraphQL Integration

### Key Queries
- `GET_QUESTIONS` - Fetch all questions
- `GET_QUESTION` - Fetch single question
- `GET_ANSWERS_BY_QUESTION` - Fetch answers for a question
- `GET_VOTE_STATS` - Get vote count for an answer
- `ME_QUERY` - Get current user info

### Key Mutations
- `LOGIN_MUTATION` - User authentication
- `REGISTER_MUTATION` - User registration
- `CREATE_QUESTION` - Create new question
- `CREATE_ANSWER` - Create new answer
- `CREATE_VOTE` - Vote on an answer

## 🎨 UI Components

### Core Components
- **Navbar**: Navigation with auth state, notifications bell
- **Question Cards**: Question display with tags and metadata
- **Answer Cards**: Answer display with voting system
- **Form Components**: Question/answer creation forms

### Design System
- **Colors**: Blue primary, gray neutrals
- **Typography**: Clear hierarchy with proper font weights
- **Spacing**: Consistent padding and margins
- **Interactions**: Hover states, loading states, disabled states

## 🔐 Authentication Flow

1. User submits login/register form
2. GraphQL mutation called with credentials
3. JWT token returned and stored in localStorage
4. Apollo Client adds token to all subsequent requests
5. AuthContext provides user state throughout app
6. Protected routes redirect to login if not authenticated

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Responsive navbar with mobile menu
- **Forms**: Touch-friendly inputs and buttons
- **Content**: Optimized reading experience on all screen sizes

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend-domain.com/graphql
```

## 🔧 Development Tips

### Adding New Features
1. Create TypeScript types in `lib/types.ts`
2. Add GraphQL queries in `lib/graphql-queries.ts`
3. Create page components in `app/` directory
4. Use Apollo hooks for data fetching
5. Handle loading and error states

### State Management
- **Global State**: AuthContext for user authentication
- **Server State**: Apollo Client cache for GraphQL data
- **Local State**: React useState for component state

### Error Handling
- GraphQL errors displayed with user-friendly messages
- Network errors handled gracefully
- Form validation with clear error states

## 📈 Performance Optimizations

- **Apollo Cache**: Intelligent caching of GraphQL responses
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js automatic image optimization
- **Static Generation**: ISR for frequently accessed content

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use ESLint and Prettier for code formatting
3. Write meaningful commit messages
4. Test on multiple screen sizes
5. Ensure accessibility standards

## 📄 License

This project is part of the StackIt Q&A platform.

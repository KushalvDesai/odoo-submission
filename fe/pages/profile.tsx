
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import QuestionCard from '@/components/QuestionCard'
import AnswerCard from '@/components/AnswerCard'
import { User, Calendar, Award, HelpCircle, MessageSquare, Settings } from 'lucide-react'
import { Question, Answer } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [userQuestions, setUserQuestions] = useState<Question[]>([])
  const [userAnswers, setUserAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated && typeof window !== 'undefined') {
      router.push('/login')
      return
    }

    const fetchUserData = async () => {
      try {
        setLoading(true)
        // Placeholder data
        setUserQuestions([])
        setUserAnswers([])
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user && isAuthenticated) {
      fetchUserData()
    }
  }, [user, isAuthenticated, router])

  // Show loading or redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <Card className="bg-slate-800 border-slate-700 mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="bg-blue-600 text-white text-xl">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {user.username}
                  </h1>
                  <p className="text-slate-300 mb-2">{user.email}</p>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    Member since {formatDate(user.createdAt || new Date().toISOString())}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="mt-4 md:mt-0"
                  onClick={() => {/* TODO: Open edit profile modal */}}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {user.reputation || 0}
                </p>
                <p className="text-slate-400 text-sm">Reputation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <HelpCircle className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {userQuestions.length}
                </p>
                <p className="text-slate-400 text-sm">Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {userAnswers.length}
                </p>
                <p className="text-slate-400 text-sm">Answers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {userAnswers.filter(answer => answer.isAccepted).length}
                </p>
                <p className="text-slate-400 text-sm">Accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="questions" className="data-[state=active]:bg-slate-700">
            Questions ({userQuestions.length})
          </TabsTrigger>
          <TabsTrigger value="answers" className="data-[state=active]:bg-slate-700">
            Answers ({userAnswers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : userQuestions.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6 text-center">
                <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No questions yet
                </h3>
                <p className="text-slate-400 mb-4">
                  Start contributing to the community by asking your first question
                </p>
                <Button 
                  onClick={() => router.push('/ask')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Ask Your First Question
                </Button>
              </CardContent>
            </Card>
          ) : (
            userQuestions.map(question => (
              <div key={question.id} onClick={() => router.push(`/question/${question.id}`)}>
                <QuestionCard question={question} />
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="answers" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : userAnswers.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6 text-center">
                <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No answers yet
                </h3>
                <p className="text-slate-400 mb-4">
                  Help the community by answering questions
                </p>
                <Button 
                  onClick={() => router.push('/')}
                  variant="outline"
                >
                  Browse Questions
                </Button>
              </CardContent>
            </Card>
          ) : (
            userAnswers.map(answer => (
              <AnswerCard 
                key={answer.id} 
                answer={answer as any}
                isQuestionOwner={false}
                onVote={() => {}}
                onAccept={() => {}}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}


import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useQuestion } from '@/hooks/useQuestion'
import { useVoting } from '@/hooks/useVoting'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import AnswerCard from '@/components/AnswerCard'
import RichTextEditor from '@/components/RichTextEditor'
import { ArrowLeft, ArrowUp, ArrowDown, MessageSquare, Calendar, Check } from 'lucide-react'

export default function QuestionPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, isAuthenticated } = useAuth()
  const { question, answers, loading, error, refetch } = useQuestion(id as string)
  const { vote, loading: voteLoading } = useVoting()
  
  const [answerContent, setAnswerContent] = useState('')
  const [submittingAnswer, setSubmittingAnswer] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Question not found</h2>
        <p className="text-slate-400 mb-6">
          The question you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push('/')}>
          Return to Home
        </Button>
      </div>
    )
  }

  const handleVote = async (type: 'UP' | 'DOWN', targetId: string, targetType: 'question' | 'answer') => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    try {
      await vote({
        type,
        targetId,
        targetType
      })
      refetch()
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!answerContent.trim()) {
      return
    }

    setSubmittingAnswer(true)
    try {
      // TODO: Implement answer submission
      setAnswerContent('')
      refetch()
    } catch (error) {
      console.error('Error submitting answer:', error)
    } finally {
      setSubmittingAnswer(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Question Card */}
      <Card className="bg-slate-800 border-slate-700 mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-4">
                {question.title}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Vote buttons */}
            <div className="flex flex-col items-center space-y-2 ml-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('UP', question.id, 'question')}
                disabled={voteLoading}
                className={`p-2 ${question.userVote?.type === 'UP' ? 'text-blue-500' : 'text-slate-400'} hover:text-blue-500`}
              >
                <ArrowUp className="w-6 h-6" />
              </Button>
              <span className="text-xl font-bold text-white">
                {question.votes}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote('DOWN', question.id, 'question')}
                disabled={voteLoading}
                className={`p-2 ${question.userVote?.type === 'DOWN' ? 'text-red-500' : 'text-slate-400'} hover:text-red-500`}
              >
                <ArrowDown className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="prose prose-invert max-w-none mb-6">
            <div 
              className="text-slate-200"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                {question.answerCount} {question.answerCount === 1 ? 'answer' : 'answers'}
              </span>
              {question.hasAcceptedAnswer && (
                <span className="flex items-center text-green-500">
                  <Check className="w-4 h-4 mr-1" />
                  Accepted answer
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={question.author.avatar} alt={question.author.username} />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {getInitials(question.author.username)}
                  </AvatarFallback>
                </Avatar>
                <span>{question.author.username}</span>
              </div>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(question.createdAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6">
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>
        
        <div className="space-y-6">
          {answers.map((answer: any) => (
            <AnswerCard 
              key={answer.id} 
              answer={answer}
              isQuestionOwner={user?.id === question.author.id}
              onVote={(answerId: string, type: 'up' | 'down') => 
                handleVote(type.toUpperCase() as 'UP' | 'DOWN', answerId, 'answer')
              }
              onAccept={(answerId: string) => {
                console.log('Accept answer:', answerId)
              }}
            />
          ))}
        </div>
      </div>

      {/* Answer Form */}
      {isAuthenticated ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Your Answer</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div className="min-h-[200px]">
                <RichTextEditor
                  content={answerContent}
                  onChange={setAnswerContent}
                  placeholder="Write your answer here..."
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAnswerContent('')}
                  disabled={submittingAnswer || !answerContent.trim()}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  disabled={submittingAnswer || !answerContent.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {submittingAnswer ? 'Submitting...' : 'Post Answer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-300 mb-4">
              You need to be logged in to post an answer
            </p>
            <Button 
              onClick={() => router.push('/login')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign In to Answer
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!
  
  return {
    props: {
      questionId: id,
    },
  }
}

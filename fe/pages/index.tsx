
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useQuestions } from '@/hooks/useQuestions'
import { useAuth } from '@/contexts/AuthContext'
import QuestionCard from '@/components/QuestionCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus } from 'lucide-react'
import { Question } from '@/types'

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { questions, loading, error } = useQuestions()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filteredQuestions = questions?.filter((question: Question) => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => question.tags.includes(tag))
    return matchesSearch && matchesTags
  }) || []

  const allTags = [...new Set(questions?.flatMap((q: Question) => q.tags) || [])] as string[]

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading questions: {error.message}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to StackIt
          </h1>
          <p className="text-slate-300">
            Ask questions, share knowledge, and help others learn
          </p>
        </div>
        <Button 
          onClick={() => router.push('/ask')}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ask Question
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>

        {/* Tags Filter */}
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer hover:bg-blue-600 transition-colors"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">
              {searchTerm || selectedTags.length > 0 
                ? 'No questions match your search criteria' 
                : 'No questions yet'}
            </p>
            {user && (
              <Button 
                onClick={() => router.push('/ask')}
                variant="outline"
              >
                Be the first to ask a question
              </Button>
            )}
          </div>
        ) : (
          filteredQuestions.map((question: Question) => (
            <div key={question.id} onClick={() => router.push(`/question/${question.id}`)}>
              <QuestionCard 
                question={question}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  }
}

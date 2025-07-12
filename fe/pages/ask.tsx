
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/contexts/AuthContext'
import { useCreateQuestion } from '@/hooks/useCreateQuestion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import RichTextEditor from '@/components/RichTextEditor'
import TagInput from '@/components/TagInput'
import { ArrowLeft, Send } from 'lucide-react'

export default function AskPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { createQuestion, loading, error } = useCreateQuestion()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[]
  })

  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated && typeof window !== 'undefined') {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Show loading if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!formData.title.trim()) {
      setValidationError('Question title is required')
      return
    }

    if (formData.title.length < 10) {
      setValidationError('Question title must be at least 10 characters long')
      return
    }

    if (!formData.description.trim()) {
      setValidationError('Question description is required')
      return
    }

    if (formData.description.length < 20) {
      setValidationError('Question description must be at least 20 characters long')
      return
    }

    if (formData.tags.length === 0) {
      setValidationError('Please add at least one tag')
      return
    }

    if (formData.tags.length > 5) {
      setValidationError('Maximum 5 tags allowed')
      return
    }

    try {
      const questionId = await createQuestion({
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: formData.tags
      })

      if (questionId) {
        router.push(`/question/${questionId}`)
      }
    } catch (err) {
      console.error('Error creating question:', err)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, title: e.target.value }))
    if (validationError) setValidationError(null)
  }

  const handleDescriptionChange = (content: string) => {
    setFormData(prev => ({ ...prev, description: content }))
    if (validationError) setValidationError(null)
  }

  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }))
    if (validationError) setValidationError(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
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

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Ask a Question</h1>
        <p className="text-slate-300">
          Get help from the community by asking a clear and detailed question
        </p>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Question Details</CardTitle>
          <CardDescription className="text-slate-300">
            Provide clear and specific information to get the best answers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {(error || validationError) && (
              <Alert variant="destructive">
                <AlertDescription>{error || validationError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Question Title *
              </Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                placeholder="What's your programming question? Be specific."
                maxLength={200}
              />
              <p className="text-sm text-slate-400">
                {formData.title.length}/200 characters • Be specific and imagine you're asking a question to another person
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Question Description *
              </Label>
              <div className="min-h-[200px]">
                <RichTextEditor
                  content={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Provide all the details. What did you try? What specifically isn't working?"
                />
              </div>
              <p className="text-sm text-slate-400">
                Include what you've tried, any error messages, and expected vs actual results
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-white">
                Tags *
              </Label>
              <TagInput
                tags={formData.tags}
                onChange={handleTagsChange}
                placeholder="Add up to 5 tags to describe what your question is about"
              />
              <p className="text-sm text-slate-400">
                Add 1-5 tags to categorize your question (e.g., javascript, react, nextjs)
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.title || !formData.description || formData.tags.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  'Publishing...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Publish Question
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

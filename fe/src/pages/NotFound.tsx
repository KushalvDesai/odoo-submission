import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-slate-600">404</h1>
          <h2 className="text-3xl font-bold text-white mt-4 mb-2">
            Page Not Found
          </h2>
          <p className="text-slate-300 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
              
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-slate-400 text-sm mb-4">
                Looking for something specific?
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => router.push('/ask')}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-slate-300"
                >
                  Ask a question
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-slate-300"
                >
                  Sign in to your account
                </Button>
                <Button
                  onClick={() => router.push('/profile')}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-slate-300"
                >
                  View your profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

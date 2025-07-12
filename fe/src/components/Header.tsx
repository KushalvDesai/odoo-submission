
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Search, Plus, User, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useAuth } from '../contexts/AuthContext'
import NotificationDropdown from './NotificationDropdown'

export default function Header() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <header className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
              StackIt
            </Link>
            
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-700"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/ask">
                    <Plus className="h-4 w-4 mr-2" />
                    Ask Question
                  </Link>
                </Button>
                
                <NotificationDropdown />
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    asChild
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Link href="/profile">
                      <User className="h-4 w-4 mr-2" />
                      {user?.username}
                    </Link>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild className="text-slate-300 hover:text-white">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

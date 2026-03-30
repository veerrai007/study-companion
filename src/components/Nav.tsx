'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Home, FileText, UserPlus, LogIn, LogOut, LayoutDashboard } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

export default function Nav() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    ...(session ? [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Documents', href: '/documentPage', icon: FileText }
    ] : []),
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="group flex items-center gap-2.5 transition-all duration-300 hover:scale-105"
        >
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl text-white shadow-md group-hover:shadow-lg group-hover:from-indigo-400 group-hover:to-purple-500 transition-all duration-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 hidden sm:block">
            StudyCompanion
          </span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="flex items-center gap-1.5 md:gap-2 absolute left-1/2 transform -translate-x-1/2 hidden md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || (pathname?.startsWith(link.href) && link.href !== '/')
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 overflow-hidden group 
                  ${isActive 
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/80 dark:bg-indigo-900/20' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium'
                  }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="text-sm">{link.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Navigation Links */}
        <nav className="flex items-center gap-1 md:hidden ml-auto mr-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || (pathname?.startsWith(link.href) && link.href !== '/')
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`p-2 rounded-full transition-all duration-300 ${isActive ? 'text-indigo-600 bg-indigo-50/80 dark:bg-indigo-900/20' : 'text-muted-foreground hover:bg-muted/50'}`}
                title={link.name}
              >
                <Icon className="w-5 h-5" />
              </Link>
            )
          })}
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {status === 'loading' ? (
            <div className="w-24 h-9 bg-muted animate-pulse rounded-full" />
          ) : session ? (
             <div className="flex items-center gap-4">
              <div className="flex flex-col items-end hidden lg:flex">
                <span className="text-sm font-semibold text-foreground leading-none">
                  {session.user?.name || 'User'}
                </span>
                <span className="text-xs text-muted-foreground mt-1 truncate max-w-[120px]">
                  {session.user?.email}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/40 rounded-full transition-colors shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline-block">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/sign-in" 
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-sm font-medium hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline-block">Sign In</span>
              </Link>
              <Link 
                href="/sign-up" 
                className="flex items-center gap-1.5 px-3 sm:px-5 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <UserPlus className="w-4 h-4 hidden sm:inline-block" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

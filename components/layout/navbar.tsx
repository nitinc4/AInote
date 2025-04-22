'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Pen, Plus, LogOut, User2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function Navbar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  
  // Don't show navbar on auth pages
  if (pathname.startsWith('/auth')) {
    return null
  }
  
  const isAuthenticated = !!user
  const homeLink = isAuthenticated ? '/dashboard' : '/'
  const navItems = isAuthenticated
    ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'New Note', href: '/notes/new' },
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'Sign In', href: '/auth/login' },
        { label: 'Sign Up', href: '/auth/signup' },
      ]

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={homeLink} className="flex items-center gap-2">
            <Pen className="h-6 w-6" />
            <span className="font-semibold">SmartNotes</span>
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex gap-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button asChild variant="outline" size="sm" className="hidden md:flex">
                <Link href="/notes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Note
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || ''} />
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <User2 className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notes/new">
                      <Plus className="mr-2 h-4 w-4" />
                      New Note
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
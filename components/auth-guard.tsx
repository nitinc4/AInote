'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

type AuthGuardProps = {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip if still loading
    if (loading) return
    
    // Check if user is authenticated
    const isAuthenticated = !!user
    
    // Public routes that don't require authentication
    const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/verify']
    
    // Check if current route is a public route
    const isPublicRoute = publicRoutes.includes(pathname)
    
    if (!isAuthenticated && !isPublicRoute) {
      // Not authenticated and not on a public route, redirect to login
      router.push('/auth/login')
    } else if (isAuthenticated && isPublicRoute && pathname !== '/') {
      // Authenticated and on an auth route, redirect to dashboard
      router.push('/dashboard')
    }
  }, [user, loading, pathname, router])

  // Show nothing while loading
  if (loading) {
    return null
  }

  return <>{children}</>
}
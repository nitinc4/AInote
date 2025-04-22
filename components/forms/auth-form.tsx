'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'

const authFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
})

type AuthFormValues = z.infer<typeof authFormSchema>

type AuthFormProps = {
  type: 'login' | 'signup'
}

export function AuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: AuthFormValues) {
    setIsLoading(true)

    try {
      if (type === 'login') {
        const { error } = await signIn(data.email, data.password)
        
        if (error) {
          let description = 'Something went wrong. Please try again.'
          
          if (error.code === 'invalid_credentials') {
            description = 'Invalid email or password. Please check your credentials or sign up if you don\'t have an account.'
          }
          
          toast({
            title: 'Error',
            description,
            variant: 'destructive',
          })
          return
        }
        
        toast({
          title: 'Success',
          description: 'You have been logged in',
        })
        router.push('/dashboard')
      } else {
        await signUp(data.email, data.password)
        toast({
          title: 'Success',
          description: 'Account created. Check your email for verification',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        toast({
          title: 'Error',
          description: 'Could not sign in with Google. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {type === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>
      </Form>

      {type === 'login' && (
        <div className="text-sm text-center">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      )}

      {type === 'signup' && (
        <div className="text-sm text-center">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
              Login
            </Link>
          </p>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
        )}
        Google
      </Button>
    </div>
  )
}
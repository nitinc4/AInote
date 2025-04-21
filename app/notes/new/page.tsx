'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NoteForm } from '@/components/forms/note-form'
import { AuthGuard } from '@/components/auth-guard'
import { useCreateNote } from '@/lib/api/notes'
import { useToast } from '@/hooks/use-toast'

export default function NewNotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const createNote = useCreateNote()
  const { toast } = useToast()

  const handleSubmit = async (data: {
    title: string
    content: string
    summary?: string | null
  }) => {
    setIsSubmitting(true)
    
    try {
      await createNote.mutateAsync(data)
      toast({
        title: 'Success',
        description: 'Your note has been created.',
      })
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create note. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthGuard>
      <div className="container py-10">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Note</h1>
            <p className="text-muted-foreground">
              Add a new note to your collection
            </p>
          </div>
          <NoteForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </AuthGuard>
  )
}
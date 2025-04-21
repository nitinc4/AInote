'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { NoteForm } from '@/components/forms/note-form'
import { AuthGuard } from '@/components/auth-guard'
import { useNote, useUpdateNote } from '@/lib/api/notes'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function EditNotePage() {
  const params = useParams()
  const noteId = params.id as string
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { data: note, isLoading } = useNote(noteId)
  const updateNote = useUpdateNote()
  const { toast } = useToast()

  const handleSubmit = async (data: {
    title: string
    content: string
    summary?: string | null
  }) => {
    setIsSubmitting(true)
    
    try {
      await updateNote.mutateAsync({
        id: noteId,
        ...data
      })
      toast({
        title: 'Success',
        description: 'Your note has been updated.',
      })
      router.push(`/notes/${noteId}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update note. Please try again.',
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
            <h1 className="text-3xl font-bold tracking-tight mb-2">Edit Note</h1>
            <p className="text-muted-foreground">
              Update your note
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !note ? (
            <p>Note not found or you don&apos;t have permission to edit it.</p>
          ) : (
            <NoteForm
              initialData={{
                title: note.title,
                content: note.content,
                summary: note.summary,
              }}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
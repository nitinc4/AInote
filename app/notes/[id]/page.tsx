'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Trash2, Loader2, Sparkles } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { useNote, useDeleteNote, useSummarizeNote, useUpdateNote } from '@/lib/api/notes'
import { AuthGuard } from '@/components/auth-guard'
import { formatDistance } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function NotePage() {
  const params = useParams()
  const noteId = params.id as string
  const router = useRouter()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  
  const { data: note, isLoading } = useNote(noteId)
  const deleteNote = useDeleteNote()
  const summarize = useSummarizeNote()
  const updateNote = useUpdateNote()

  const handleEdit = () => {
    router.push(`/notes/${noteId}/edit`)
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteNote.mutateAsync(noteId)
      toast({
        title: 'Note deleted',
        description: 'Your note has been permanently deleted.',
      })
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete note. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  const handleSummarize = async () => {
    if (!note || !note.content || note.content.trim().length < 50) {
      toast({
        title: 'Content too short',
        description: 'Please add more content to generate a summary (at least 50 characters).',
        variant: 'destructive',
      })
      return
    }
  
    setIsSummarizing(true)
  
    try {
      const summary = await summarize.mutateAsync(note.content)
  
      await updateNote.mutateAsync({
        id: noteId,
        summary
      })
  
      toast({
        title: 'Summary generated',
        description: 'AI summary has been created for your note.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate summary.',
        variant: 'destructive',
      })
    } finally {
      setIsSummarizing(false)
    }
  }

  return (
    <AuthGuard>
      <div className="container py-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !note ? (
            <Card>
              <CardContent className="p-6">
                <p>Note not found or you don&apos;t have permission to view it.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{note.title}</h1>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="flex items-center text-sm mb-8 text-muted-foreground">
                <p>
                  Last updated {formatDistance(
                    new Date(note.updated_at),
                    new Date(),
                    { addSuffix: true }
                  )}
                </p>
              </div>

              <div className="prose prose-neutral dark:prose-invert max-w-none mb-10">
                {note.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <Separator className="my-8" />

              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                    AI Summary
                  </h2>
                  {!note.summary && (
                    <Button 
                      size="sm" 
                      onClick={handleSummarize}
                      disabled={isSummarizing}
                    >
                      {isSummarizing && (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      )}
                      Generate Summary
                    </Button>
                  )}
                </div>
                {note.summary ? (
                  <Card>
                    <CardContent className="p-4">
                      <p className="italic">{note.summary}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No summary available. Generate one to get a concise overview of your note.
                  </p>
                )}
              </div>

              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your note and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={confirmDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleteNote.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
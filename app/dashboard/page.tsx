'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NoteCard } from '@/components/ui/note-card'
import { useNotes, useDeleteNote } from '@/lib/api/notes'
import { useAuth } from '@/hooks/useAuth'
import { AuthGuard } from '@/components/auth-guard'
import { useRouter } from 'next/navigation'
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
import { useToast } from '@/hooks/use-toast'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  const { data: notes, isLoading } = useNotes()
  const deleteNote = useDeleteNote()

  const handleEditNote = (id: string) => {
    router.push(`/notes/${id}/edit`)
  }

  const handleDeleteNote = (id: string) => {
    setSelectedNoteId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedNoteId) return
    
    try {
      await deleteNote.mutateAsync(selectedNoteId)
      toast({
        title: 'Note deleted',
        description: 'Your note has been permanently deleted.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete note. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setDeleteDialogOpen(false)
      setSelectedNoteId(null)
    }
  }

  const handleViewNote = (id: string) => {
    router.push(`/notes/${id}`)
  }

  return (
    <AuthGuard>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Notes</h1>
            <p className="text-muted-foreground mt-1">
              Manage and organize your thoughts in one place
            </p>
          </div>
          <Button asChild>
            <Link href="/notes/new">
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : notes?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <div className="border-4 border-dashed border-muted p-12 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">No notes yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first note to get started
              </p>
              <Button asChild>
                <Link href="/notes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Note
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes?.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                summary={note.summary}
                createdAt={note.created_at}
                updatedAt={note.updated_at}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onView={handleViewNote}
              />
            ))}
          </div>
        )}

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
      </div>
    </AuthGuard>
  )
}
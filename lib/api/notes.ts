'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/database.types'

type Note = Database['public']['Tables']['notes']['Row']
type InsertNote = Database['public']['Tables']['notes']['Insert']
type UpdateNote = Database['public']['Tables']['notes']['Update']

// Get all notes for the current user
export const useNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false })
      
      if (error) throw error
      return data as Note[]
    }
  })
}

// Get a single note by ID
export const useNote = (id: string) => {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as Note
    },
    enabled: !!id
  })
}

// Create a new note
export const useCreateNote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (note: Omit<InsertNote, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('notes')
        .insert({
          ...note,
          user_id: user.id
        })
        .select()
        .single()
      
      if (error) throw error
      return data as Note
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })
}

// Update an existing note
export const useUpdateNote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...note }: UpdateNote & { id: string }) => {
      const { data, error } = await supabase
        .from('notes')
        .update(note)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Note
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.invalidateQueries({ queryKey: ['notes', data.id] })
    }
  })
}

// Delete a note
export const useDeleteNote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })
}

// Generate AI summary for a note
export const useSummarizeNote = () => {
  return useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ content })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to summarize note')
      }
      
      const { summary } = await response.json()
      return summary as string
    }
  })
}
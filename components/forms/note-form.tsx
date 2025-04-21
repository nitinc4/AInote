'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useSummarizeNote } from '@/lib/api/notes'

const noteFormSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }).max(100, {
    message: 'Title cannot be longer than 100 characters',
  }),
  content: z.string().min(1, {
    message: 'Content is required',
  }),
  summary: z.string().nullable().optional(),
})

type NoteFormValues = z.infer<typeof noteFormSchema>

type NoteFormProps = {
  initialData?: NoteFormValues
  onSubmit: (data: NoteFormValues) => Promise<void>
  isSubmitting?: boolean
}

export function NoteForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: NoteFormProps) {
  const [isSummarizing, setIsSummarizing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const summarize = useSummarizeNote()
  
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: initialData || {
      title: '',
      content: '',
      summary: '',
    },
  })

  const handleSummarize = async () => {
    const content = form.getValues('content')
    
    if (!content || content.trim().length < 50) {
      toast({
        title: 'Content too short',
        description: 'Please add more content to generate a summary (at least 50 characters).',
        variant: 'destructive',
      })
      return
    }
    
    setIsSummarizing(true)
    
    try {
      const summary = await summarize.mutateAsync(content)
      form.setValue('summary', summary)
      toast({
        title: 'Summary generated',
        description: 'AI summary has been created for your note.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Note title" 
                  {...field} 
                  className="text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your note here..." 
                  {...field} 
                  className="min-h-[300px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Summary (AI Generated)</FormLabel>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                >
                  {isSummarizing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Summary
                </Button>
              </div>
              <FormControl>
                <Textarea 
                  placeholder="AI generated summary will appear here..." 
                  {...field} 
                  value={field.value || ''}
                  className="h-[100px] bg-muted/50"
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Note
          </Button>
        </div>
      </form>
    </Form>
  )
}
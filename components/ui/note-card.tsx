'use client'

import { useState } from 'react'
import { formatDistance } from 'date-fns'
import { Edit, Trash2, MoveRight } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type NoteCardProps = {
  id: string
  title: string
  content: string
  summary?: string | null
  createdAt: string
  updatedAt: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
}

export function NoteCard({
  id,
  title,
  content,
  summary,
  createdAt,
  updatedAt,
  onEdit,
  onDelete,
  onView,
}: NoteCardProps) {
  const [isHovering, setIsHovering] = useState(false)
  
  const displayDate = formatDistance(
    new Date(updatedAt),
    new Date(),
    { addSuffix: true }
  )

  const truncatedContent = content.length > 200 
    ? content.substring(0, 200) + '...' 
    : content

  return (
    <Card 
      className={cn(
        'group transition-all duration-300 hover:shadow-md',
        isHovering ? 'ring-1 ring-primary' : ''
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader className="pb-2">
        <CardTitle 
          className="line-clamp-1 cursor-pointer text-lg transition-colors hover:text-primary"
          onClick={() => onView(id)}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div 
          className="cursor-pointer text-sm text-muted-foreground"
          onClick={() => onView(id)}
        >
          <p className="line-clamp-4 mb-2">{truncatedContent}</p>
          {summary && (
            <div className="mt-2 rounded-md bg-secondary p-2 text-xs italic">
              <p className="mb-1 font-semibold">AI Summary:</p>
              <p>{summary}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0">
        <p className="text-xs text-muted-foreground">{displayDate}</p>
        <div className="flex space-x-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit note</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit note</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onDelete(id)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete note</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete note</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => onView(id)}>
                <MoveRight className="h-4 w-4" />
                <span className="sr-only">View note</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>View note</TooltipContent>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  )
}
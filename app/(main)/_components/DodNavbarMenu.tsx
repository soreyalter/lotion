'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Skeleton from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

interface DocNavbarMenuProps {
  documentId: Id<'documents'>
}

const DocNavbarMenu = ({ documentId }: DocNavbarMenuProps) => {
  const router = useRouter()
  const archive = useMutation(api.documents.archive)
  const { user } = useUser()
  const onArchive = () => {
    const promise = archive({ id: documentId }).then(() =>
      router.push('/documents'),
    )
    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note moved to trash!',
      error: 'Failed to archive note.',
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size={'sm'} variant={'ghost'}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        // 强制这个下拉菜单保持在dom中，而不是触发时再挂载
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="p-2 text-xs text-muted-foreground">
          Last edited by {user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

DocNavbarMenu.Skeleton = function DocNavbarMenuSkeleton() {
  return <Skeleton className='h-9 w-9' />
}

export default DocNavbarMenu

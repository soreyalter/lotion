'use client'

import ConfirmModal from '@/components/modals/ConfirmModal'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { ArchiveRestore, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

interface BannerProps {
  documentId: Id<'documents'>
}

/** 归档文档提示横幅 */
const Banner = ({ documentId }: BannerProps) => {
  const restore = useMutation(api.documents.restore)
  const remove = useMutation(api.documents.remove)
  const router = useRouter()

  const onConfirm = () => {
    const promise = remove({ id: documentId }).then(() => router.push('/documents'))

    toast.promise(promise, {
      loading: 'Deleting note...',
      success: 'Note deleted!',
      error: 'Failed to delete note.',
    })

    // router.push('/documents')
  }

  const onRestore = () => {
    const promise = restore({ id: documentId })
    toast.promise(promise, {
      loading: 'Restoring page...',
      success: 'Page restored!',
      error: 'Failed to restore page.',
    })
  }

  return (
    <div className="flex items-center justify-center gap-x-3 bg-red-400 py-2 text-white">
      <p>This page has been deleted.</p>
      <Button
        variant={'outline'}
        size={'sm'}
        className="border-2 border-white bg-transparent hover:bg-primary/5 hover:text-white"
        onClick={onRestore}
      >
        <ArchiveRestore />
        <span className="pl-2">Restore page</span>
      </Button>
      <ConfirmModal onConfirm={onConfirm}>
        <Button
          variant={'outline'}
          size={'sm'}
          className="border-2 border-white bg-transparent hover:bg-primary/5 hover:text-white"
        >
          <Trash2Icon />
          <span className="pl-2">Delete forever</span>
        </Button>
      </ConfirmModal>
    </div>
  )
}

export default Banner

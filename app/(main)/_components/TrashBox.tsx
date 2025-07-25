import ConfirmModal from '@/components/modals/ConfirmModal'
import Spinner from '@/components/Spinner'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { Search, Trash, Undo } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const TrashBox = () => {
  const router = useRouter()
  const params = useParams()
  const documents = useQuery(api.documents.getTrash)
  const restore = useMutation(api.documents.restore)
  const remove = useMutation(api.documents.remove)

  const [search, setSearch] = useState<string>('')

  // 依据输入的关键词 过滤 查找对应的文档
  const filteredDocumtns = documents?.filter((document) =>
    document.title.toLowerCase().includes(search.toLowerCase()),
  )

  /** 点击查看对应文档的内容 */
  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`)
  }

  const onRestore = (event: React.MouseEvent, documentId: Id<'documents'>) => {
    event.stopPropagation()
    const promise = restore({ id: documentId })
    toast.promise(promise, {
      loading: 'Restoring note...',
      success: 'Note restored!',
      error: 'Error restoring note',
    })
  }

  const onRemove = (documentId: Id<'documents'>) => {
    const promise = remove({ id: documentId })
    toast.promise(promise, {
      loading: 'Restoring note...',
      success: 'Note restored!',
      error: 'Error restoring note',
    })

    // 当前打开的是被删除的页面
    if (params.documentId === documentId) {
      router.push('/documents')
    }
  }

  if (documents === undefined) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Spinner size={'lg'} />
      </div>
    )
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          // TODO：或许这里可以做一下防抖
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 bg-secondary px-2 focus-visible:ring-transparent"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden pb-2 text-center text-xs text-muted-foreground last:block">
          No documents found.
        </p>
        {filteredDocumtns?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => onClick(document._id)}
            className="flex w-full items-center rounded-md text-sm text-primary hover:bg-primary/5"
          >
            <span className="truncate pl-2">{document.title}</span>
            <div
              className="ml-auto rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              role="button"
              onClick={(e) => onRestore(e, document._id)}
            >
              <Undo className="h-4 w-4 text-muted-foreground" />
            </div>
            <ConfirmModal onConfirm={() => onRemove(document._id)}>
              <div
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Trash className="h-4 w-4 text-muted-foreground" />
              </div>
            </ConfirmModal>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrashBox

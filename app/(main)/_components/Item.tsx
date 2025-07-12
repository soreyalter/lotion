import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Skeleton from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

interface ItemProps {
  /** document 记录的ID，标志这是否为一个 document Item */
  id?: Id<'documents'>
  /** document Item 的 icon */
  documentIcon?: string
  active?: boolean
  expanded?: boolean
  /** 标志这是否为一个 Search Action Item，是的话这将是一个输入框 */
  isSearch?: boolean
  level?: number
  onExpand?: () => void
  onClick?: () => void
  label: string
  /** action Item（即非文档 Item）用的 icon*/
  icon: LucideIcon
}

/** action item 或 document item 共用 */
const Item = ({
  // 重命名为 Icon 以便将其用作组件标签
  icon: Icon,
  id,
  label,
  active,
  documentIcon,
  expanded,
  isSearch,
  level = 0,
  onClick,
  onExpand,
}: ItemProps) => {
  const router = useRouter()
  const { user } = useUser()
  const create = useMutation(api.documents.create)
  const archive = useMutation(api.documents.archive)
  const ChevronIcon = expanded ? ChevronDown : ChevronRight

  const handleExpand = (event: React.MouseEvent) => {
    event.stopPropagation()
    onExpand?.()
  }

  const onCreate = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!id) return

    const promise = create({
      title: 'Untitled',
      parentDocument: id,
    }).then((documentId) => {
      if (!expanded) {
        onExpand?.()
      }
      router.push(`/documents/${documentId}`)
      toast.promise(promise, {
        loading: 'Creating a new file...',
        success: 'New note created',
        error: 'Failed to create a new note',
      })
    })
  }

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if (!id) return

    const promise = archive({id}).then(() => {
      // router.push("/documents")
    })
    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive the note."
    })
  }

  return (
    <div
      role="button"
      onClick={onClick}
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : '12px' }}
      className={cn(
        'group flex min-h-[27px] w-full select-none items-center py-1 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5',
        active && 'bg-primary/5 text-primary',
      )}
    >
      {!!id && (
        <div
          role="button"
          className="mr-1 h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="mr-2 w-[18px] shrink-0 text-[18px] text-muted-foreground">
          {documentIcon}
        </div>
      ) : (
        <Icon className="mr-2 shrink-0 text-[18px] text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}

      {/* 有 id，说明这条是文档而不是 action */}
      {!!id && (
        <div
          role="button"
          onClick={onCreate}
          className="ml-auto flex items-center gap-x-2"
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e) => e.stopPropagation()}
              asChild 
            >
              <div
                role='button'
                className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'
              >
                <MoreHorizontal className='w-4 h-4 text-muted-foreground' />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-60' align='start' side='right' forceMount>
              <DropdownMenuItem onClick={onArchive}>
                <Trash className='w-4 h-4 mr-2' />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className='text-xs text-muted-foreground p-2'>Last edited by {user?.fullName}</div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="ml-auto h-full rounded-sm opacity-0 hover:bg-neutral-300 group-hover:opacity-100 dark:hover:bg-neutral-600">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}

/** Item 的骨架屏版本组件 */
Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : '12px',
      }}
      className='flex gap-x-2 py-3'
    >
      {/* ■ —— */}
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  )
}

export default Item

/**
 * 这是一种在 React 中非常常见且优雅的模式，称为复合组件（Compound Components）或命名空间组件（Namespaced Components）。
 * 核心概念：函数也是对象
 * 要理解 Item.Skeleton，首先需要记住 JavaScript (以及 TypeScript) 的一个核心特性：函数是头等公民（First-class citizens）。
 * 这意味着函数本质上也是一种特殊的对象，因此你可以像给普通对象添加属性一样，给一个函数添加属性。
 */
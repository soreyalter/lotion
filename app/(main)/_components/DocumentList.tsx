'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Item from './Item'
import { cn } from '@/lib/utils'
import { FileIcon } from 'lucide-react'

interface DocumentListProps {
  parentDocumentId?: Id<'documents'>
  level?: number
}

/** 侧边栏文档列表 */
const DocumentList = ({
  level = 0,
  parentDocumentId,
}: DocumentListProps) => {
  const params = useParams()
  // const router = useRouter()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const onExpand = (documentId: string) => {
    setExpanded((prevState) => ({
      ...prevState,
      // 计算属性 [documentId] 表示将这个变量的值作为对象的 key
      [documentId]: !prevState[documentId],
    }))
  }

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  })

  const onRedirect = (documentId: string) => {
    // router.push(`/documents/${documentId}`)
  }

  // 顶层
  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level}></Item.Skeleton>
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    )
  }

  // 非顶层
  return (
    <>
      {/* 只在非顶层 展开 没有子文档 展示这段提示 */}
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80',
          expanded && 'last:block',
          level === 0 && 'hidden',
        )}
      >
        No pages inside
      </p>
      {documents?.map((document) => (
        <div key={document._id}>
          <Item
            id={document._id}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            expanded={expanded[document._id]}
            onExpand={() => onExpand(document._id)}
            onClick={() => onRedirect(document._id)}
            level={level}
          />
          {expanded[document._id] && (
            <DocumentList level={level + 1} parentDocumentId={document._id} />
          )}
        </div>
      ))}
    </>
  )
}

export default DocumentList

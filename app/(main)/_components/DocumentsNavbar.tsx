'use client'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { MenuIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import Title from './Title'
import Banner from './Banner'
import DocNavbarMenu from './DodNavbarMenu'

interface DocumentsNavbarProps {
  isCollapsed: boolean
  onResetWidth: () => void
}

/** 文档页顶部的导航栏*/
const DocumentsNavbar = ({
  isCollapsed,
  onResetWidth,
}: DocumentsNavbarProps) => {
  const params = useParams()
  const router = useRouter()

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<'documents'>,
  })

  // 加载中
  if (document === undefined) {
    return (
      <nav className="flex w-full items-center bg-background px-3 py-2 dark:bg-[#1f1f1f]">
        <Title.Skeleton />
        {/* <DocNavbarMenu.Skeleton /> */}
      </nav>
    )
  }

  // 文档不存在，跳转到文档列表页
  if (document === null) {
    router.push('/documents')
    return null
  }

  return (
    <>
      <nav className="flex w-full items-center gap-x-4 bg-background px-3 py-2 dark:bg-[#1f1f1f]">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex w-full items-center justify-between">
          <Title initData={document} />
          <div>
            <DocNavbarMenu documentId={document._id} />
          </div>
        </div>
      </nav>
      {/* 打开已归档的 Doc 时，上方呈现一条提示 */}
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  )
}

export default DocumentsNavbar

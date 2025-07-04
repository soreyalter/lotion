import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { MenuIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'
import Title from './Title'

interface DocumentsNavbarProps {
  isCollapsed: boolean
  onResetWidth: () => void
}

const DocumentsNavbar = ({
  isCollapsed,
  onResetWidth,
}: DocumentsNavbarProps) => {
  const params = useParams()
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<'documents'>,
  })

  if (document === undefined) {
    return (
      <nav className="flex w-full items-center bg-background px-3 py-2 dark:bg-[#1f1f1f]">
        <Title.Skeleton />
      </nav>
    )
  }

  if (document === null) {
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
        </div>
      </nav>
    </>
  )
}

export default DocumentsNavbar

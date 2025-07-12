'use client'

import ToolBar from '@/components/ToolBar'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import React from 'react'

interface DocumentsIdPageProps {
  params: {
    documentId: Id<'documents'>
  }
}

const DocumentsIdPage = ({params} : DocumentsIdPageProps) => {
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId
  })

  if (document === undefined) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  if (document === null) {
    return (
      <div>
        Not Found.
      </div>
    )
  }

  return (
    <div className='pb-40'>
      <div className='h-[35vh]'></div>
      <ToolBar initialData={document} />
      <div className='pt-4'>DocumentsIdPage: {params.documentId}</div>

    </div>
  )
}

export default DocumentsIdPage
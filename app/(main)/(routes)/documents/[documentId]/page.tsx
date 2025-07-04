import React from 'react'

interface DocumentsIdPageProps {
  params: {
    documentId: string
  }
}

const DocumentsIdPage = ({params} : DocumentsIdPageProps) => {
  return (
    <div className='pt-4'>DocumentsIdPage: {params.documentId}</div>
  )
}

export default DocumentsIdPage
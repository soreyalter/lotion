'use client'

import Spinner from '@/components/spinner'
import { useConvexAuth } from 'convex/react'
import { redirect } from 'next/navigation'

import React from 'react'
import Navigation from './_components/navigation'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={'lg'}></Spinner>
      </div>
    )
  }
  if (!isAuthenticated) {
    return redirect('/')
  }
  return (
    <div className="h-full flex dark:bg-[1f1f1f">
      <Navigation></Navigation>
      <main>{children}</main>
    </div>
  )
}

export default MainLayout

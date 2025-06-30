'use client'

import Spinner from '@/components/Spinner'
import { useConvexAuth } from 'convex/react'
import { redirect } from 'next/navigation'

import React from 'react'
import Navigation from './_components/Navigation'
import { SearchCommand } from '@/components/SearchCommand'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  // 通过convex api 获取用户认证信息，实现鉴权
  const { isAuthenticated, isLoading } = useConvexAuth()
  if (isLoading) {
    // 加载中
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size={'lg'}></Spinner>
      </div>
    )
  }
  if (!isAuthenticated) {
    // 未登录认证，跳转到首页
    return redirect('/')
  }
  return (
    <div className="flex h-full dark:bg-[1f1f1f]">
      <Navigation />
      <main className="h-full flex-1 overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}

export default MainLayout

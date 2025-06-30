'use client'

import Spinner from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/clerk-react'
import { useConvexAuth } from 'convex/react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Heading() {
  const { isLoading, isAuthenticated } = useConvexAuth()
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents, & Plans. Unified. Welcome to{' '}
        <span className="underline">Lotion</span>.
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium">
        Lotion is the connected workspace where <br />
        better, faster work happens.
      </h3>
      {isLoading && (
        <div className="w-full flex items-center justify-center">
          <Spinner size={'lg'}></Spinner>
        </div>
      )}
      {isAuthenticated && !isLoading && (
        // asChild 允许ui组件内部嵌套别的组件或者html元素
        // 并将 Button 的样式效果传递到内部的元素中
        <Button asChild>
          <Link href={'/documents'}>
            Enter Lotion
            <ArrowRight className="h-4 w-4 ml-2"></ArrowRight>
          </Link>
        </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode='modal'>
          <Button>
            Get Lotion free
            <ArrowRight className='h-4 w-4 ml-2'></ArrowRight>
          </Button>
        </SignInButton>
      )}
    </div>
  )
}

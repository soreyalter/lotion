'use client'

import { useScrollTop } from '@/hooks/useScrollTop'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { ModeToggle } from '@/components/mode-toggle'
import { useConvexAuth } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/spinner'
import Link from 'next/link'

const Navbar = () => {
  // 获取用户验证状态，是否已验证，是否在加载中
  const { isAuthenticated, isLoading } = useConvexAuth()
  // 使用自定义 hook 获取滚动状态
  const scrolled = useScrollTop()
  return (
    <div
      className={cn(
        'z-50 bg-background dark:bg-[#1f1f1f] fixed top-0 flex items-center w-screen p-6',
        scrolled && 'border-b shadow-sm',
      )}
    >
      <Logo />
      <div
        className="md:ml-auto md:justify-end justify-between
          w-full flex items-center gap-x-2"
      >
        {/* 正在加载，显示Spinner组件 */}
        {isLoading && <Spinner />}
        {/* 加载完毕，未登录，显示登录按钮 */}
        {!isLoading && !isAuthenticated && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">Get Lotion free</Button>
            </SignInButton>
          </>
        )}
        {/* 加载完毕，已登录 */}
        {!isLoading && isAuthenticated && (
          <div className='flex items-center'>
            <Button variant={"ghost"} size={"sm"} asChild>
              <Link href="/documents">
                Enter Lotion
              </Link>
            </Button>
            {/* afterSignOutUrl 参数已经废弃并成为 Clerk 的全局配置参数
                在 ClerkProvider 上配置这个参数或者在 await Clerk.load() 中配置 */}
            <UserButton />
          </div>
        )}
        <ModeToggle />
      </div>
    </div>
  )
}

export default Navbar

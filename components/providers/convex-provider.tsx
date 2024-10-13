'use client'

import { ReactNode } from 'react'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'

// ClerkProvider 和 ConvexProviderWithClerk 提供内置上下文系统
// 所以这里不使用 useContext Hook 来创建上下文

// 创建Convex客户端
const convex: ConvexReactClient = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!,
)

// 自定义 Provider
export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider
      afterSignOutUrl={'/'}
      // Clerk 的公开密钥，用于初始化身份验证服务
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk
        // useAuth 是 Clerk 的钩子，获取当前用户的身份验证状态和相关信息
        useAuth={useAuth}
        client={convex}
      >
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

import React from 'react'
import { Poppins } from 'next/font/google'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { NextFont } from 'next/dist/compiled/@next/font'

const font: NextFont = Poppins({
  // 指定字符集，按需加载资源
  subsets: ['latin'],
  // 字重400-常规字体，600-加粗
  weight: ['400', '600'],
})

export const Logo: React.FC = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image
        src="/logo.svg"
        height="40"
        width="40"
        alt="logo"
        className="dark:hidden"
      ></Image>
      <Image
        src="/logo-dark.svg"
        height="40"
        width="40"
        alt="logo"
        className="hidden dark:block"
      ></Image>
      {/* cn 是一个动态组合类名的函数 */}
      <p className={cn('font-semibold', font.className)}>
        Lotion
      </p>
    </div>
  )
}

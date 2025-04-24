import type { Metadata } from 'next'
// import localFont from 'next/font/local'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ConvexClientProvider } from '@/components/providers/convex-provider'

// const geistSans = localFont({
//   src: './fonts/GeistVF.woff',
//   variable: '--font-geist-sans',
//   weight: '100 900',
// })
// const geistMono = localFont({
//   src: './fonts/GeistMonoVF.woff',
//   variable: '--font-geist-mono',
//   weight: '100 900',
// })

const inter = Inter({ subsets: ['latin'] })

// mata 元数据
export const metadata: Metadata = {
  // <title>Lotion</title>
  title: 'Lotion',
  // <meta name="description" content="Notion clone app">
  description: 'Notion clone app',
  icons: {
    icon: [
      {
        // <link rel="icon" href="/logo.svg" media="(prefers-color-scheme: light)">
        media: '(prefers-color-scheme: light)',
        url: '/logo.svg',
        href: '/logo.svg',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/logo-dark.svg',
        href: '/logo-dark.svg',
      },
    ],
  },
}

// 布局函数，必须接收一个 children prop
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning 抑制 ssr 和客户端渲染不一致的警告
    <html lang="en" suppressHydrationWarning>
      {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> */}
      <body className={inter.className}>
        {/* 提供convex后端服务和clerk身份验证 */}
        <ConvexClientProvider>
          {/* shacn-ui 主题切换 */}
          <ThemeProvider
            // 通过添加或者移除 css class 来改变外观
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="jotion-theme-2"
          >
            <Toaster position="bottom-center" />
            {children}
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}

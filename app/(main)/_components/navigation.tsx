'use client'

import { cn } from '@/lib/utils'
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { ElementRef, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import UserItem from './UserItem'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Item from './Item'
import { toast } from 'sonner'
import DocumentList from './DocumentList'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import TrashBox from './TrashBox'
import { useSearchStore } from '@/hooks/useSearch'
import { useSettingsStore } from '@/hooks/useSetttings'

/** documents 页的左侧侧边栏 */
const Navigation = () => {
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 768px')
  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ElementRef<'aside'>>(null)
  const navbarRef = useRef<ElementRef<'div'>>(null)
  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const create = useMutation(api.documents.create)
  const searchStore = useSearchStore()
  const settingsStore = useSettingsStore()

  // 应对从网页端缩小到移动端时的情况
  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetWidth()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, pathname])

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    isResizingRef.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return
    let newWidth = event.clientX
    if (newWidth < 240) newWidth = 240
    if (newWidth > 480) newWidth = 480
    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
      navbarRef.current.style.setProperty('left', `${newWidth}px`)
      navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`)
    }
  }

  const handleMouseUp = () => {
    isResizingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false)
      setIsResetting(true)

      // 如果是移动端设备，侧边栏应该要占满整个屏幕，还要把顶部的 nav 给隐藏掉
      sidebarRef.current.style.width = isMobile ? '100%' : '240px'
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100% - 240px)',
      )
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px')
      setTimeout(() => setIsResetting(false), 300)
    }
  }

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)
      sidebarRef.current.style.width = '0'
      // navbarRef.current.style.setProperty('width', '100%')
      // navbarRef.current.style.setProperty('left', '0')
      navbarRef.current.style.width = '100%'
      navbarRef.current.style.left = '0'

      setTimeout(() => setIsResetting(false), 300)
    }
  }

  const handleCreate = () => {
    const promise = create({ title: 'Untitle' })

    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New Note created successfully!',
      error: 'Failed to create a new note.',
    })
  }

  return (
    <>
      {/* tailwindcss 可以定义一个组group/sidebar，组名为sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar relative z-[99999] flex h-full w-60 flex-col overflow-y-auto bg-secondary',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'w-0',
        )}
      >
        <div
          role="button"
          onClick={collapse}
          className={cn(
            'absolute right-2 top-2 h-6 w-6 rounded-sm text-muted-foreground opacity-0 transition hover:bg-neutral-300 group-hover/sidebar:opacity-100 dark:hover:bg-neutral-600',
            isMobile && 'opacity-100',
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>

        {/* 顶部用户头像栏以及 action Item */}
        <div>
          <UserItem />
          <Item
            icon={Search}
            label="Search"
            isSearch
            onClick={searchStore.onOpen}
          />
          <Item
            icon={Settings}
            label="Settings"
            onClick={settingsStore.onOpen}
          />
          <Item icon={PlusCircle} label="New Page" onClick={handleCreate} />
        </div>

        {/* 文档列表 */}
        <div className="mt-4">
          <DocumentList />
          <Item onClick={handleCreate} label="Add a page" icon={Plus} />
          <Popover>
            <PopoverTrigger className="mt-4 w-full">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="w-72 p-0"
              side={isMobile ? 'bottom' : 'right'}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>

        {/* 纵向分隔符 */}
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition group-hover/sidebar:opacity-100"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          'absolute left-60 top-0 z-[99999] w-[calc(100%-240px)]',
          isResetting && 'transition-all duration-300 ease-in-out',
          isMobile && 'left-0 w-full',
        )}
      >
        <nav className="w-full bg-transparent px-3 py-2">
          {isCollapsed && (
            <MenuIcon
              role="button"
              onClick={resetWidth}
              className="h-6 w-6 text-muted-foreground"
            />
          )}
        </nav>
      </div>
    </>
  )
}

export default Navigation

"use client"

import { useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { useSearchStore } from '@/hooks/useSearch'
import { useUser } from '@clerk/clerk-react'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { File } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const SearchCommand = () => {
  const { user } = useUser()
  // 防止 hydration error，配合 useEffect 使用，因为 useEffect 只在 client 执行
  const [isMounted, setIsMounted] = useState(false)
  // const { isOpen, toggle, onClose } = useSearchStore()
  const toggle = useSearchStore((state) => state.toggle)
  const isOpen = useSearchStore((state) => state.isOpen)
  const onClose = useSearchStore((state) => state.onClose)
  const userDocuments = useQuery(api.documents.getSearch)
  const router = useRouter()

  const handleSelect = (id: string) => {
    router.push(`/documents/${id}`)
    onClose()
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.altKey && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener('keydown', down)

    return () => {
      document.removeEventListener('keydown', down)
    }
  }, [toggle])

  // 防止水合错误：nextjs会在服务端对 client 组件进行预渲染
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.fullName}'s Lotion`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {userDocuments?.map((doc) => (
            <CommandItem
              key={doc._id}
              value={`${doc._id}-${doc.title}`}
              title={doc.title}
              onSelect={() => handleSelect(doc._id)}
            >
              {doc.icon ? (
                <p className="mr-2 text-[18px]">{doc.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{doc.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

'use client'

import { Doc } from '@/convex/_generated/dataModel'
import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useDebounceCallback } from 'usehooks-ts'
import Skeleton from '@/components/ui/skeleton'

interface TitleProps {
  initData: Doc<'documents'>
}

const Title = ({ initData }: TitleProps) => {
  const [inputData, setInputData] = useState(initData.title || 'Untitled')
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)

  const update = useMutation(api.documents.update)

  const handlerOpenChange = (open: boolean) => {
    if (open) {
      // 渲染后再触发 focus
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }
  // 防抖，限制发送 update 请求
  const debouceUpdate = useDebounceCallback(update, 1000)

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData(e.target.value)
    debouceUpdate({
      title: e.target.value || 'Untitled',
      id: initData._id,
    })
  }

  const handleInteractOutside = () => {
    setOpen(false)
    if (inputData === '') {
      setInputData(() => inputData || 'Untitled')
    }
  }

  return (
    <div className="flex items-center gap-x-1">
      {!!initData.icon && <p>{initData.icon}</p>}

      <Popover onOpenChange={handlerOpenChange} open={open}>
        <PopoverTrigger asChild>
          <Button
            className="truncate"
            variant={'ghost'}
            size={'sm'}
            onClick={() => setOpen(true)}
          >
            {inputData}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="px-2 py-1"
          onInteractOutside={handleInteractOutside}
        >
          <div
            onClick={(event) => {
              event.stopPropagation()
            }}
            className="flex items-center gap-x-1 outline-none"
          >
            {!!initData.icon && <p>{initData.icon}</p>}
            {/* <span>Title: </span> */}
            <Input
              ref={inputRef}
              value={inputData}
              onChange={onInputChange}
              className="h-8 focus:bg-primary/5 focus-visible:ring-0"
              onKeyDown={(e) => e.key === 'Enter' && setOpen(false)}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="w-32 h-9 rounded-md" />
}

export default Title

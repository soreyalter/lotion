'use client'

import { Doc } from '@/convex/_generated/dataModel'
import React from 'react'
import IconPicker from './IconPicker'
import { Button } from './ui/button'
import { Smile, X } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

interface ToolBarProps {
  initialData: Doc<'documents'>
  preview?: boolean
}

const ToolBar = ({ initialData, preview }: ToolBarProps) => {
  const update = useMutation(api.documents.update)
  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon
    })
  }
  const onRemoveIcon = () => {
    //
  }
  return (
    <div className="group relative pl-[54px]">
      {!!initialData.icon && !preview && (
        <div className="group/icon flex items-center gap-x-2 pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl transition hover:opacity-75">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full text-xs text-muted-foreground opacity-0 transition group-hover/icon:opacity-100"
            size="icon"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="pt-6 text-6xl">{initialData.icon}</p>
      )}
      <div className="flex items-center gap-x-1 py-4 opacity-0 group-hover:opacity-100">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-xs text-muted-foreground"
              variant="outline"
              size="sm"
            >
              <Smile className="mr-2 h-4 w-4" />
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            // onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            {/* <ImageIcon className="h-4 w-4 mr-2" /> */}
            Add cover
          </Button>
        )}
      </div>
    </div>
  )
}

export default ToolBar

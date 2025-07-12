'use client'

import { useTheme } from 'next-themes'
import React, { ReactNode } from 'react'
import EmojiPicker, { Theme } from 'emoji-picker-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

interface IconPickerProps {
  onChange: (icon: string) => void
  children: ReactNode
  asChild?: boolean
}

const IconPicker = ({ children, onChange, asChild }: IconPickerProps) => {
  const { resolvedTheme } = useTheme()
  const currentTheme = (resolvedTheme || 'light') as keyof typeof themeMap

  const themeMap = {
    light: Theme.LIGHT,
    dark: Theme.DARK,
  }
  const theme = themeMap[currentTheme]

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="w-full border-none p-0 shadow-none">
        <EmojiPicker
          height={350}
          theme={theme}
          onEmojiClick={(data) => {
            onChange(data.emoji)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export default IconPicker

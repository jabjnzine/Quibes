'use client'

import * as React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const SIZE_CLASS = {
  sm: 'w-[360px]',
  md: 'w-[480px]',
  lg: 'w-[640px]',
} as const

export interface AppSheetProps {
  open: boolean
  onClose: (open: boolean) => void
  title: string
  description?: string
  side?: 'left' | 'right'
  size?: keyof typeof SIZE_CLASS
  className?: string
  children: React.ReactNode
}

export function AppSheet({
  open,
  onClose,
  title,
  description,
  side = 'right',
  size = 'md',
  className,
  children,
}: AppSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side={side}
        className={cn(
          SIZE_CLASS[size],
          'flex flex-col max-w-full overflow-y-auto',
          className,
        )}
      >
        <SheetHeader className="shrink-0">
          <SheetTitle className="font-display text-copper text-xl">
            {title}
          </SheetTitle>
          {description && (
            <SheetDescription className="text-gray-400 text-sm">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">{children}</div>
      </SheetContent>
    </Sheet>
  )
}

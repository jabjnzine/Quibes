'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const SIZE_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
} as const

export interface AppDialogProps {
  open: boolean
  onClose: (open: boolean) => void
  title: string
  description?: string
  size?: keyof typeof SIZE_MAP
  /** Remove default padding — useful when content controls its own spacing */
  noPadding?: boolean
  className?: string
  children: React.ReactNode
}

export function AppDialog({
  open,
  onClose,
  title,
  description,
  size = 'md',
  noPadding = false,
  className,
  children,
}: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          SIZE_MAP[size],
          'max-h-[90vh] overflow-y-auto',
          className,
        )}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-copper text-xl">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-gray-400 text-sm">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className={cn(!noPadding && 'pt-1')}>{children}</div>
      </DialogContent>
    </Dialog>
  )
}

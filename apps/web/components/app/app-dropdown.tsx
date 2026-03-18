'use client'

import * as React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface DropdownItem {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  /** Renders as a red destructive item */
  danger?: boolean
  disabled?: boolean
  /** Renders a separator BEFORE this item */
  separator?: boolean
}

export interface AppDropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  label?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

export function AppDropdown({
  trigger,
  items,
  label,
  align = 'end',
  side = 'bottom',
  className,
}: AppDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger as React.ReactElement} />
      <DropdownMenuContent
        align={align}
        side={side}
        className={cn('min-w-44 rounded-xl border-gray-200 shadow-lg', className)}
      >
        {label && (
          <>
            <DropdownMenuLabel className="text-xs text-gray-400 font-normal">
              {label}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {item.separator && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={item.onClick}
              disabled={item.disabled}
              className={cn(
                'flex items-center gap-2 rounded-lg text-sm cursor-pointer',
                item.danger
                  ? 'text-danger focus:text-danger focus:bg-danger/5'
                  : 'text-gray-700 focus:text-gray-900',
              )}
            >
              {item.icon && (
                <span className="shrink-0 opacity-70">{item.icon}</span>
              )}
              {item.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

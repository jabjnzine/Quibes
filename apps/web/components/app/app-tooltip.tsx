'use client'

import * as React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface AppTooltipProps {
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  className?: string
  children: React.ReactNode
}

export function AppTooltip({
  content,
  side = 'top',
  align = 'center',
  delayDuration,
  className,
  children,
}: AppTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex items-center">{children}</span>} />
      <TooltipContent
        side={side}
        align={align}
        className={cn(
          'bg-espresso text-white text-xs rounded-md px-2.5 py-1.5 max-w-xs',
          className,
        )}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

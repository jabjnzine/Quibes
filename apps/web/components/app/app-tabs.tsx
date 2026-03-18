'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export interface TabItem {
  value: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
  disabled?: boolean
  children: React.ReactNode
}

export interface AppTabsProps {
  tabs: TabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  listClassName?: string
}

export function AppTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
  listClassName,
}: AppTabsProps) {
  const controlled = value !== undefined

  return (
    <Tabs
      defaultValue={defaultValue ?? tabs[0]?.value}
      value={controlled ? value : undefined}
      onValueChange={onValueChange}
      className={cn('w-full', className)}
    >
      <TabsList
        className={cn(
          'h-auto p-1 bg-gray-100 rounded-lg gap-0.5',
          listClassName,
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium',
              'data-[state=active]:bg-white data-[state=active]:text-copper data-[state=active]:shadow-sm',
              'text-gray-500 hover:text-gray-700',
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="ml-0.5 rounded-full bg-copper/10 text-copper text-xs px-1.5 py-0.5 leading-none">
                {tab.badge}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-4">
          {tab.children}
        </TabsContent>
      ))}
    </Tabs>
  )
}

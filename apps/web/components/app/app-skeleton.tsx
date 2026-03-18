import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Base pulse block ─────────────────────────────────────────────────────────

function Bone({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn('rounded-md bg-gray-100 animate-pulse', className)} style={style} />
}

// ─── TableSkeleton ────────────────────────────────────────────────────────────

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 bg-gray-50">
        {[40, 100, 80, 60, 80].map((w, i) => (
          <Bone key={i} className={`h-3.5`} style={{ width: w }} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3.5 border-b border-gray-50 last:border-0"
        >
          <Bone className="h-8 w-8 rounded-full" />
          <Bone className="h-3.5 w-32" />
          <Bone className="h-3.5 w-24" />
          <Bone className="h-3.5 w-20" />
          <Bone className="h-5 w-16 rounded-full" />
          <Bone className="h-3.5 w-12 ml-auto" />
        </div>
      ))}
    </div>
  )
}

// ─── CardSkeleton ─────────────────────────────────────────────────────────────

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-5 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Bone className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Bone className="h-4 w-40" />
          <Bone className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <Bone className="h-3.5 w-full" />
        <Bone className="h-3.5 w-4/5" />
        <Bone className="h-3.5 w-3/5" />
      </div>
      <div className="flex gap-2 pt-1">
        <Bone className="h-8 w-20 rounded-lg" />
        <Bone className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

// ─── PageSkeleton ─────────────────────────────────────────────────────────────

export function PageSkeleton() {
  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Bone className="h-7 w-36" />
          <Bone className="h-4 w-52" />
        </div>
        <Bone className="h-9 w-28 rounded-lg" />
      </div>
      {/* Filter bar */}
      <div className="flex gap-3">
        <Bone className="h-9 flex-1 max-w-xs rounded-lg" />
        <Bone className="h-9 w-20 rounded-lg" />
        <Bone className="h-9 w-20 rounded-lg" />
        <Bone className="h-9 w-20 rounded-lg" />
      </div>
      {/* Table */}
      <TableSkeleton rows={8} />
    </div>
  )
}

// ─── StatCardSkeleton ─────────────────────────────────────────────────────────

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Bone className="h-3.5 w-24" />
        <Bone className="h-8 w-8 rounded-lg" />
      </div>
      <Bone className="h-8 w-20" />
      <Bone className="h-3 w-28" />
    </div>
  )
}

// ─── AppSkeleton namespace export ─────────────────────────────────────────────

export const AppSkeleton = {
  Table: TableSkeleton,
  Card: CardSkeleton,
  Page: PageSkeleton,
  StatCard: StatCardSkeleton,
  Bone,
}

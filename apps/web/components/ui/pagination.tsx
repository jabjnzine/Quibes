'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, total, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  // Windowed 5-page slice centered around current page
  const windowSize = 5
  const start = Math.max(1, Math.min(page - 2, totalPages - windowSize + 1))
  const pages = Array.from(
    { length: Math.min(windowSize, totalPages) },
    (_, i) => start + i,
  )

  return (
    <div className={cn('flex items-center justify-between px-1 py-3', className)}>
      <p className="text-sm text-gray-500">
        ทั้งหมด <span className="font-semibold text-gray-800">{total.toLocaleString()}</span> รายการ
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="หน้าก่อนหน้า"
        >
          <ChevronLeft size={15} />
        </button>

        {start > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-gray-400 text-sm">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-md border text-sm transition-colors',
              p === page
                ? 'bg-copper text-white border-copper font-medium'
                : 'border-gray-200 text-gray-600 hover:bg-gray-100',
            )}
          >
            {p}
          </button>
        ))}

        {start + windowSize - 1 < totalPages && (
          <>
            {start + windowSize < totalPages && (
              <span className="px-1 text-gray-400 text-sm">…</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="หน้าถัดไป"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

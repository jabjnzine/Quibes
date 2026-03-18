'use client'

import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react'
import { useUIStore } from '@/stores/ui.store'

const ICON = {
  success: <CheckCircle2 size={16} className="text-success shrink-0" />,
  error: <AlertCircle size={16} className="text-danger shrink-0" />,
  warning: <AlertTriangle size={16} className="text-warning shrink-0" />,
}

const BORDER = {
  success: 'border-l-success',
  error: 'border-l-danger',
  warning: 'border-l-warning',
}

function Toast({ id, type, message }: { id: string; type: 'success' | 'error' | 'warning'; message: string }) {
  const removeToast = useUIStore((s) => s.removeToast)

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 4000)
    return () => clearTimeout(timer)
  }, [id, removeToast])

  return (
    <div
      className={`flex items-start gap-3 bg-white rounded-lg border border-gray-200 border-l-4 ${BORDER[type]} shadow-md px-4 py-3 min-w-64 max-w-80 animate-in slide-in-from-right-5 fade-in duration-200`}
    >
      {ICON[type]}
      <p className="text-sm text-gray-800 flex-1 leading-snug">{message}</p>
      <button
        onClick={() => removeToast(id)}
        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-0.5"
        aria-label="ปิด"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function Toaster() {
  const toasts = useUIStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} />
      ))}
    </div>
  )
}

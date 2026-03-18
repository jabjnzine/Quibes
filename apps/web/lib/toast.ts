import { useUIStore } from '@/stores/ui.store'

type ToastType = 'success' | 'error' | 'warning'

export function showToast(message: string, type: ToastType = 'success'): void {
  if (typeof window === 'undefined') return
  useUIStore.getState().addToast({ message, type })
}

'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'
import { useLogout } from '@/hooks/use-auth'
import { showToast } from '@/lib/toast'

const ROLE_LABELS: Record<string, string> = {
  admin: 'ผู้ดูแลระบบ',
  doctor: 'แพทย์',
  nurse: 'พยาบาล',
  cashier: 'แคชเชียร์',
}

export function Topbar() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  const handleLogout = async () => {
    await logout.mutateAsync()
    showToast('ออกจากระบบเรียบร้อยแล้ว', 'success')
    router.push('/login')
  }

  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : '—'

  const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : ''

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shrink-0">
      {/* Clinic name */}
      <div className="flex items-center gap-2">
        <span className="font-display font-bold text-copper text-lg hidden sm:block">
          QUIBES CLINIC
        </span>
      </div>

      {/* User info + logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 text-sm">
          <div className="w-8 h-8 rounded-full bg-copper-30 flex items-center justify-center">
            <User size={15} className="text-copper" />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-medium text-gray-800">{displayName}</span>
            <span className="text-xs text-gray-400">{roleLabel}</span>
          </div>
        </div>

        <div className="w-px h-6 bg-gray-200" />

        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          title="ออกจากระบบ"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-danger disabled:opacity-50 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">ออกจากระบบ</span>
        </button>
      </div>
    </header>
  )
}

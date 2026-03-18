'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Package2,
  MessageSquare,
  BarChart3,
  ScrollText,
  Settings2,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui.store'

const NAV_ITEMS = [
  { label: 'แดชบอร์ด', href: '/dashboard', icon: LayoutDashboard },
  { label: 'ผู้ป่วย', href: '/dashboard/patients', icon: Users },
  { label: 'นัดหมาย', href: '/dashboard/appointments', icon: CalendarDays },
  { label: 'OPD', href: '/dashboard/opd', icon: ClipboardList },
  { label: 'การเงิน', href: '/dashboard/finance', icon: CreditCard },
  { label: 'คลังสินค้า', href: '/dashboard/inventory', icon: Package2 },
  { label: 'CRM / LINE', href: '/dashboard/crm', icon: MessageSquare },
  { label: 'รายงาน', href: '/dashboard/reports', icon: BarChart3 },
  { label: 'บันทึกกิจกรรม', href: '/dashboard/logs', icon: ScrollText },
  { label: 'ตั้งค่า', href: '/dashboard/settings', icon: Settings2 },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <aside
      className={cn(
        'relative flex flex-col shrink-0 bg-white border-r border-gray-200 transition-all duration-200',
        sidebarOpen ? 'w-56' : 'w-16',
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'h-16 flex items-center border-b border-gray-200 overflow-hidden',
          sidebarOpen ? 'px-5 gap-3' : 'justify-center px-0',
        )}
      >
        <span className="font-display font-bold text-copper text-xl shrink-0">Q</span>
        {sidebarOpen && (
          <span className="font-display font-bold text-copper text-xl tracking-widest">
            UIBES
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <ul className="flex flex-col gap-0.5 px-2">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === '/dashboard' ? pathname === href : pathname.startsWith(href)

            return (
              <li key={href}>
                <Link
                  href={href}
                  title={!sidebarOpen ? label : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-copper-30 text-copper'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800',
                    !sidebarOpen && 'justify-center px-0',
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  {sidebarOpen && <span className="truncate">{label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-gray-200 p-2">
        <button
          onClick={toggleSidebar}
          title={sidebarOpen ? 'ย่อแถบด้านข้าง' : 'ขยายแถบด้านข้าง'}
          className="flex w-full items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft
            size={18}
            className={cn('transition-transform duration-200', !sidebarOpen && 'rotate-180')}
          />
        </button>
      </div>
    </aside>
  )
}

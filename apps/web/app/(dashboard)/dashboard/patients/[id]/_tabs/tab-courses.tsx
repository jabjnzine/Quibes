'use client'

import { BookOpen, CalendarX } from 'lucide-react'
import { usePatientCourses } from '@/hooks/use-patient-detail'
import { AppBadge, AppSkeleton, COURSE_STATUS_LABEL } from '@/components/app'
import { cn } from '@/lib/utils'

function formatDate(d?: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysUntil(d?: string): number | null {
  if (!d) return null
  const diff = new Date(d).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

interface TabCoursesProps {
  patientId: string
  enabled: boolean
}

export function TabCourses({ patientId, enabled }: TabCoursesProps) {
  const { data, isLoading } = usePatientCourses(patientId, enabled)

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <AppSkeleton.Card key={i} />
        ))}
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <BookOpen size={20} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">ยังไม่มีคอร์ส</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {data.map((course) => {
        const { label, variant } = COURSE_STATUS_LABEL[course.status] ?? {
          label: course.status,
          variant: 'default' as const,
        }
        const days = daysUntil(course.expiresAt)
        const isExpiringSoon = days !== null && days > 0 && days <= 30
        const pct = Math.round((course.usedSessions / course.totalSessions) * 100)

        return (
          <div
            key={course.id}
            className="rounded-xl border border-gray-200 bg-white p-4 space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-800 text-sm leading-snug">
                  {course.courseName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  ขายเมื่อ {formatDate(course.soldAt)}
                </p>
              </div>
              <AppBadge variant={variant}>{label}</AppBadge>
            </div>

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                <span>ใช้ไปแล้ว {course.usedSessions} / {course.totalSessions} ครั้ง</span>
                <span className="font-medium text-copper">{pct}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    pct >= 100 ? 'bg-gray-300' : 'bg-copper',
                  )}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>

            {/* Expiry */}
            {course.expiresAt && (
              <div
                className={cn(
                  'flex items-center gap-1.5 text-xs rounded-lg px-3 py-2',
                  isExpiringSoon
                    ? 'bg-warning/10 text-warning'
                    : days !== null && days <= 0
                      ? 'bg-danger/10 text-danger'
                      : 'bg-gray-50 text-gray-500',
                )}
              >
                <CalendarX size={13} />
                <span>
                  {days !== null && days <= 0
                    ? 'หมดอายุแล้ว'
                    : isExpiringSoon
                      ? `ใกล้หมดอายุ อีก ${days} วัน`
                      : `หมดอายุ ${formatDate(course.expiresAt)}`}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

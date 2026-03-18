'use client'

import Link from 'next/link'
import { ChevronRight, Stethoscope } from 'lucide-react'
import { usePatientOpdVisits } from '@/hooks/use-patient-detail'
import { AppBadge, AppSkeleton, APPOINTMENT_STATUS_LABEL } from '@/components/app'
import { OpdVisitStatus } from '@quibes/shared'

function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const OPD_STATUS: Record<OpdVisitStatus, { label: string; variant: 'in_progress' | 'done' | 'cancelled' | 'pending' }> = {
  [OpdVisitStatus.WAITING]:     { label: 'รอรับบริการ', variant: 'pending' },
  [OpdVisitStatus.IN_PROGRESS]: { label: 'กำลังรักษา', variant: 'in_progress' },
  [OpdVisitStatus.DONE]:        { label: 'เสร็จสิ้น',   variant: 'done' },
  [OpdVisitStatus.CANCELLED]:   { label: 'ยกเลิก',      variant: 'cancelled' },
}

interface TabOpdProps {
  patientId: string
  enabled: boolean
}

export function TabOpd({ patientId, enabled }: TabOpdProps) {
  const { data, isLoading } = usePatientOpdVisits(patientId, enabled)

  if (isLoading) return <AppSkeleton.Table rows={5} />

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <Stethoscope size={20} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">ยังไม่มีประวัติการรักษา</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left">
            <th className="px-4 py-3 font-medium text-gray-500">วันที่</th>
            <th className="px-4 py-3 font-medium text-gray-500">การวินิจฉัย</th>
            <th className="px-4 py-3 font-medium text-gray-500">แพทย์</th>
            <th className="px-4 py-3 font-medium text-gray-500">สถานะ</th>
            <th className="px-4 py-3 w-10" />
          </tr>
        </thead>
        <tbody>
          {data.map((visit) => {
            const status = OPD_STATUS[visit.status] ?? { label: visit.status, variant: 'default' as const }
            return (
              <tr
                key={visit.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
              >
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {formatDateTime(visit.startedAt)}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {visit.diagnosis ? (
                    <span className="line-clamp-1">{visit.diagnosis}</span>
                  ) : (
                    <span className="text-gray-300 italic">ไม่มีการวินิจฉัย</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {visit.doctorName ?? (
                    <span className="font-mono text-xs text-gray-300">{visit.doctorId.slice(0, 8)}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <AppBadge variant={status.variant}>{status.label}</AppBadge>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/opd/visits/${visit.id}`}
                    className="flex items-center justify-center text-gray-300 hover:text-copper transition-colors"
                  >
                    <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

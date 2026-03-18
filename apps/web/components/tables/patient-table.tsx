'use client'

import Link from 'next/link'
import { Phone, ChevronRight } from 'lucide-react'
import type { Patient } from '@quibes/shared'
import { Gender } from '@quibes/shared'
import { AppBadge } from '@/components/app/app-badge'
import { TableSkeleton } from '@/components/app/app-skeleton'

// ─── Config ───────────────────────────────────────────────────────────────────

const GENDER_LABEL: Record<Gender, string> = {
  [Gender.MALE]: 'ชาย',
  [Gender.FEMALE]: 'หญิง',
  [Gender.OTHER]: 'อื่นๆ',
}

type GenderVariant = 'confirmed' | 'pending' | 'olive'
const GENDER_VARIANT: Record<Gender, GenderVariant> = {
  [Gender.MALE]: 'confirmed',
  [Gender.FEMALE]: 'pending',
  [Gender.OTHER]: 'olive',
}

function calcAge(dob?: string): string {
  if (!dob) return '—'
  const diff = Date.now() - new Date(dob).getTime()
  return `${Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))} ปี`
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PatientTableProps {
  data?: Patient[]
  isLoading?: boolean
}

export function PatientTable({ data, isLoading = false }: PatientTableProps) {
  if (isLoading) return <TableSkeleton rows={8} />

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left">
            <th className="px-4 py-3 font-medium text-gray-500 whitespace-nowrap">รหัส</th>
            <th className="px-4 py-3 font-medium text-gray-500">ชื่อ-นามสกุล</th>
            <th className="px-4 py-3 font-medium text-gray-500">เพศ</th>
            <th className="px-4 py-3 font-medium text-gray-500">อายุ</th>
            <th className="px-4 py-3 font-medium text-gray-500">เบอร์โทร</th>
            <th className="px-4 py-3 w-10" />
          </tr>
        </thead>
        <tbody>
          {data?.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-16 text-center text-gray-400 text-sm">
                ไม่พบข้อมูลผู้ป่วย
              </td>
            </tr>
          )}

          {data?.map((patient) => (
            <tr
              key={patient.id}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors"
            >
              <td className="px-4 py-3 font-mono text-xs text-gray-400">
                {patient.code}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/patients/${patient.id}`}
                  className="font-medium text-gray-800 hover:text-copper transition-colors"
                >
                  {patient.firstName} {patient.lastName}
                </Link>
              </td>
              <td className="px-4 py-3">
                <AppBadge variant={GENDER_VARIANT[patient.gender]}>
                  {GENDER_LABEL[patient.gender]}
                </AppBadge>
              </td>
              <td className="px-4 py-3 text-gray-600">{calcAge(patient.dob)}</td>
              <td className="px-4 py-3 text-gray-600">
                {patient.phone ? (
                  <a
                    href={`tel:${patient.phone}`}
                    className="inline-flex items-center gap-1.5 hover:text-copper transition-colors"
                  >
                    <Phone size={13} className="text-gray-400" />
                    {patient.phone}
                  </a>
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/patients/${patient.id}`}
                  className="flex items-center justify-center text-gray-300 hover:text-copper transition-colors"
                >
                  <ChevronRight size={16} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

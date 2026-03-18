'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Phone,
  CalendarDays,
  Stethoscope,
  Pencil,
  AlertTriangle,
  CreditCard,
  Eye,
  EyeOff,
} from 'lucide-react'

import { usePatient, useUpdatePatient, usePatientNationalId } from '@/hooks/use-patients'
import { usePatientStore } from '@/stores/patient.store'
import { useAuthStore } from '@/stores/auth.store'
import { PatientForm, type PatientFormValues } from '@/components/forms/patient-form'
import { AppButton, AppSheet, AppBadge, AppSkeleton, AppTabs, AppTooltip } from '@/components/app'
import { showToast } from '@/lib/toast'
import { getApiErrors, getApiMessage } from '@/lib/errors'
import { Gender, Role } from '@quibes/shared'
import type { NationalIdResult } from '@/hooks/use-patients'
import { cn } from '@/lib/utils'
import type { Patient } from '@quibes/shared'

import { TabOpd }            from './_tabs/tab-opd'
import { TabBeforeAfter }    from './_tabs/tab-before-after'
import { TabCourses }        from './_tabs/tab-courses'
import { TabLab }            from './_tabs/tab-lab'
import { TabPayments }       from './_tabs/tab-payments'
import { TabDiary }          from './_tabs/tab-diary'
import { TabMedicalHistory } from './_tabs/tab-medical-history'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GENDER_LABEL: Record<Gender, string> = {
  [Gender.MALE]:   'ชาย',
  [Gender.FEMALE]: 'หญิง',
  [Gender.OTHER]:  'อื่นๆ',
}

type GenderVariant = 'confirmed' | 'pending' | 'olive'
const GENDER_VARIANT: Record<Gender, GenderVariant> = {
  [Gender.MALE]:   'confirmed',
  [Gender.FEMALE]: 'pending',
  [Gender.OTHER]:  'olive',
}

function calcAge(dob?: string) {
  if (!dob) return null
  const diff = Date.now() - new Date(dob).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

function formatDate(d?: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('th-TH', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  })
}

// ─── National ID badge (show/hide, role-aware) ────────────────────────────────

function NationalIdBadge({
  patientId,
  role,
}: {
  patientId: string
  role:      Role
}) {
  const [revealed, setRevealed] = useState(false)

  // CASHIER — không hiển thị
  if (role === Role.CASHIER) return null

  // NURSE — always masked, no toggle
  if (role === Role.NURSE) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <CreditCard size={14} className="text-gray-400 shrink-0" />
        <span className="text-sm font-mono tracking-wider text-gray-400">
          X-XXXX-XXXXX-XX-X
        </span>
      </div>
    )
  }

  // ADMIN / DOCTOR — fetch on demand (only when revealed)
  return (
    <NationalIdReveal patientId={patientId} revealed={revealed} onToggle={() => setRevealed((r) => !r)} />
  )
}

function NationalIdReveal({
  patientId,
  revealed,
  onToggle,
}: {
  patientId: string
  revealed:  boolean
  onToggle:  () => void
}) {
  const { data, isFetching } = usePatientNationalId(patientId, revealed)

  const display = (() => {
    if (!revealed)    return 'X-XXXX-XXXXX-XX-X'
    if (isFetching)   return 'กำลังโหลด...'
    if (!data?.hasValue) return 'ไม่ได้ระบุ'
    if (data?.masked) return data.nationalId
    // Format: X XXXX XXXXX XX X
    const n = data?.nationalId ?? ''
    return n.length === 13
      ? `${n[0]}-${n.slice(1, 5)}-${n.slice(5, 10)}-${n.slice(10, 12)}-${n[12]}`
      : n
  })()

  return (
    <div className="flex items-center gap-2 text-gray-600">
      <CreditCard size={14} className="text-gray-400 shrink-0" />
      <span className={cn(
        'text-sm font-mono tracking-wider',
        !revealed ? 'text-gray-400' : 'text-gray-800',
      )}>
        {display}
      </span>
      <button
        type="button"
        onClick={onToggle}
        className="text-gray-400 hover:text-copper transition-colors"
        aria-label={revealed ? 'ซ่อน' : 'แสดง'}
      >
        {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
    </div>
  )
}

// ─── Profile Card ─────────────────────────────────────────────────────────────

function ProfileCard({
  patient,
  role,
  onEdit,
  onCreateOpd,
}: {
  patient:     Patient
  role:        Role
  onEdit:      () => void
  onCreateOpd: () => void
}) {
  const age = calcAge(patient.dob)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-5">
        {/* Avatar */}
        <div
          className={cn(
            'w-16 h-16 shrink-0 rounded-full flex items-center justify-center text-2xl font-bold',
            patient.gender === Gender.FEMALE ? 'bg-copper-30 text-espresso' : 'bg-info/10 text-info',
          )}
        >
          {patient.firstName.charAt(0)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Name row */}
          <div>
            <h1 className="font-display text-copper text-2xl font-bold leading-tight">
              {patient.firstName} {patient.lastName}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <code className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">
                {patient.code}
              </code>
              <AppBadge variant={GENDER_VARIANT[patient.gender]}>
                {GENDER_LABEL[patient.gender]}
              </AppBadge>
              {patient.allergy && (
                <AppTooltip content={`แพ้: ${patient.allergy}`} side="right">
                  <span className="inline-flex items-center gap-1 text-xs text-warning bg-warning/10 rounded-full px-2 py-0.5 cursor-default">
                    <AlertTriangle size={11} />
                    มีประวัติแพ้
                  </span>
                </AppTooltip>
              )}
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarDays size={14} className="text-gray-400 shrink-0" />
              <span>
                {formatDate(patient.dob)}
                {age !== null && (
                  <span className="text-gray-400 ml-1">({age} ปี)</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} className="text-gray-400 shrink-0" />
              {patient.phone ? (
                <a href={`tel:${patient.phone}`} className="hover:text-copper transition-colors">
                  {patient.phone}
                </a>
              ) : (
                <span className="text-gray-300">ไม่ระบุ</span>
              )}
            </div>
            <NationalIdBadge patientId={patient.id} role={role} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2 shrink-0">
          <AppButton
            variant="outline"
            size="sm"
            leftIcon={<Pencil size={14} />}
            onClick={onEdit}
          >
            แก้ไขข้อมูล
          </AppButton>
          <AppButton
            size="sm"
            leftIcon={<Stethoscope size={14} />}
            onClick={onCreateOpd}
          >
            สร้าง OPD
          </AppButton>
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <AppSkeleton.Bone className="h-4 w-20" />
        <AppSkeleton.Bone className="h-4 w-4" />
        <AppSkeleton.Bone className="h-4 w-32" />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex gap-5">
          <AppSkeleton.Bone className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <AppSkeleton.Bone className="h-7 w-52" />
            <div className="flex gap-2">
              <AppSkeleton.Bone className="h-5 w-16 rounded-full" />
              <AppSkeleton.Bone className="h-5 w-16 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <AppSkeleton.Bone className="h-4 w-40" />
              <AppSkeleton.Bone className="h-4 w-28" />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <AppSkeleton.Bone className="h-10 w-full rounded-lg" />
        <AppSkeleton.Table rows={5} />
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function PatientDetail({ id }: { id: string }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('opd')
  const [editOpen,  setEditOpen]  = useState(false)

  const role = useAuthStore((s) => s.user?.role as Role | undefined) ?? Role.NURSE

  const { isLoading } = usePatient(id)
  const patient = usePatientStore((s) => s.currentPatient)
  const updatePatient = useUpdatePatient(id)

  const handleUpdate = async (values: PatientFormValues) => {
    try {
      await updatePatient.mutateAsync(values)
      showToast('บันทึกข้อมูลเรียบร้อย', 'success')
      setEditOpen(false)
    } catch (error) {
      const fieldErrors = getApiErrors(error)
      if (fieldErrors) {
        showToast('กรุณาตรวจสอบข้อมูล', 'warning')
      } else {
        showToast(getApiMessage(error), 'error')
      }
    }
  }

  if (isLoading || !patient) return <DetailSkeleton />

  const tabs = [
    {
      value: 'opd',
      label: 'ประวัติการรักษา',
      children: <TabOpd patientId={id} enabled={activeTab === 'opd'} />,
    },
    {
      value: 'photos',
      label: 'Before / After',
      children: <TabBeforeAfter patientId={id} enabled={activeTab === 'photos'} />,
    },
    {
      value: 'courses',
      label: 'คอร์สคงเหลือ',
      children: <TabCourses patientId={id} enabled={activeTab === 'courses'} />,
    },
    {
      value: 'lab',
      label: 'LAB',
      children: <TabLab patientId={id} enabled={activeTab === 'lab'} />,
    },
    {
      value: 'payments',
      label: 'การชำระเงิน',
      children: <TabPayments patientId={id} enabled={activeTab === 'payments'} />,
    },
    {
      value: 'diary',
      label: 'Diary',
      children: <TabDiary patientId={id} enabled={activeTab === 'diary'} />,
    },
    {
      value: 'medical',
      label: 'ประวัติสุขภาพ',
      children: <TabMedicalHistory patient={patient} />,
    },
  ]

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/dashboard/patients"
          className="inline-flex items-center gap-1.5 hover:text-copper transition-colors"
        >
          <ArrowLeft size={14} />
          ผู้ป่วย
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">
          {patient.firstName} {patient.lastName}
        </span>
      </div>

      {/* Profile card */}
      <ProfileCard
        patient={patient}
        role={role}
        onEdit={() => setEditOpen(true)}
        onCreateOpd={() => router.push(`/dashboard/opd/new?patientId=${id}`)}
      />

      {/* Tabs */}
      <AppTabs
        tabs={tabs}
        value={activeTab}
        onValueChange={setActiveTab}
        listClassName="flex-wrap"
      />

      {/* Edit info sheet */}
      <AppSheet
        open={editOpen}
        onClose={setEditOpen}
        title="แก้ไขข้อมูลผู้ป่วย"
        description={`${patient.firstName} ${patient.lastName} · ${patient.code}`}
        size="md"
      >
        <PatientForm
          defaultValues={{
            firstName:      patient.firstName,
            lastName:       patient.lastName,
            gender:         patient.gender as PatientFormValues['gender'],
            dob:            patient.dob,
            phone:          patient.phone,
            allergy:        patient.allergy,
            medicalHistory: patient.medicalHistory,
          }}
          onSubmit={handleUpdate}
          isLoading={updatePatient.isPending}
          submitLabel="บันทึกการเปลี่ยนแปลง"
        />
      </AppSheet>
    </div>
  )
}

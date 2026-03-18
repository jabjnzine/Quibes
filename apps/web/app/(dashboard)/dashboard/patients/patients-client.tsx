'use client'

import { useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { usePatients, useCreatePatient } from '@/hooks/use-patients'
import { usePatientFilter } from '@/hooks/use-patient-filter'
import { usePagination } from '@/hooks/use-pagination'
import { PatientTable } from '@/components/tables/patient-table'
import { Pagination } from '@/components/ui/pagination'
import { PatientForm, type PatientFormValues } from '@/components/forms/patient-form'
import { AppButton, AppDialog } from '@/components/app'
import { Input } from '@/components/ui/input'
import { showToast } from '@/lib/toast'
import { getApiErrors, getApiMessage } from '@/lib/errors'
import { Gender } from '@quibes/shared'
import { cn } from '@/lib/utils'

const GENDER_OPTIONS = [
  { label: 'ทั้งหมด', value: '' },
  { label: 'ชาย', value: Gender.MALE },
  { label: 'หญิง', value: Gender.FEMALE },
  { label: 'อื่นๆ', value: Gender.OTHER },
]

export function PatientsClient() {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)

  // ─── Filter + Pagination UI state ─────────────────────────────────────────
  const filter = usePatientFilter()
  const pagination = usePagination()

  const handleSearch = (value: string) => {
    filter.setSearch(value)
    pagination.reset()
  }

  const handleGenderChange = (value: Gender | '') => {
    filter.setGender(value)
    pagination.reset()
  }

  // ─── Data ─────────────────────────────────────────────────────────────────
  const { data, isLoading } = usePatients({
    page: pagination.page,
    limit: pagination.limit,
    search: filter.search || undefined,
    gender: filter.gender || undefined,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  })

  // ─── Create ───────────────────────────────────────────────────────────────
  const createPatient = useCreatePatient()

  const handleCreate = async (values: PatientFormValues) => {
    try {
      const patient = await createPatient.mutateAsync(values)
      showToast('เพิ่มผู้ป่วยเรียบร้อยแล้ว', 'success')
      setShowCreate(false)
      router.push(`/dashboard/patients/${patient.id}`)
    } catch (error) {
      const fieldErrors = getApiErrors(error)
      if (fieldErrors) {
        showToast('กรุณาตรวจสอบข้อมูล', 'warning')
      } else {
        showToast(getApiMessage(error), 'error')
      }
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ผู้ป่วย</h1>
          <p className="text-sm text-gray-400 mt-0.5">จัดการข้อมูลผู้ป่วยทั้งหมด</p>
        </div>
        <AppButton
          leftIcon={<Plus size={15} />}
          size="sm"
          onClick={() => setShowCreate(true)}
        >
          เพิ่มผู้ป่วย
        </AppButton>
      </div>

      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-60">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <Input
            value={filter.search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="ค้นหาชื่อ นามสกุล หรือเบอร์โทร..."
            className="pl-9 pr-8"
          />
          {filter.search && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Gender pills */}
        <div className="flex items-center gap-1.5">
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleGenderChange(opt.value as Gender | '')}
              className={cn(
                'h-9 px-3.5 rounded-lg border text-sm font-medium transition-colors',
                filter.gender === opt.value
                  ? 'bg-copper text-white border-copper'
                  : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <PatientTable data={data?.data} isLoading={isLoading} />

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
      {data?.meta && (
        <Pagination
          page={pagination.page}
          totalPages={data.meta.totalPages}
          total={data.meta.total}
          onPageChange={pagination.goToPage}
        />
      )}

      {/* ── Create dialog ───────────────────────────────────────────────────── */}
      <AppDialog
        open={showCreate}
        onClose={setShowCreate}
        title="เพิ่มผู้ป่วยใหม่"
        description="กรอกข้อมูลพื้นฐานของผู้ป่วยเพื่อลงทะเบียนในระบบ"
      >
        <PatientForm
          onSubmit={handleCreate}
          isLoading={createPatient.isPending}
          submitLabel="เพิ่มผู้ป่วย"
        />
      </AppDialog>
    </div>
  )
}

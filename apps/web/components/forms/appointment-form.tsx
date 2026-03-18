'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  useForm,
  useFormContext,
  FormProvider,
  Controller,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Search, X, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePatientSearch } from '@/hooks/use-patients'
import { useDoctors, useServices } from '@/hooks/use-appointments'
import { FormSelect } from '@/components/forms/form-select'
import { FormTextarea } from '@/components/forms/form-textarea'
import { FormDatePicker } from '@/components/forms/form-date-picker'
import { AppButton } from '@/components/app/app-button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const schema = z.object({
  patientId:       z.string().uuid('กรุณาเลือกผู้ป่วย'),
  patientName:     z.string().min(1, 'กรุณาเลือกผู้ป่วย'),
  staffId:         z.string().optional(),
  serviceId:       z.string().optional(),
  date:            z.string().min(1, 'กรุณาเลือกวันที่'),
  time:            z.string().min(1, 'กรุณาเลือกเวลา'),
  durationMinutes: z.string().optional(),
  soldAt:          z.string().optional(),
  note:            z.string().max(1000).optional(),
})

export type AppointmentFormValues = z.infer<typeof schema>

export interface AppointmentFormDefaultValues {
  patientId?:       string
  patientName?:     string
  staffId?:         string
  serviceId?:       string
  date?:            string
  time?:            string
  durationMinutes?: string
  soldAt?:          string
  note?:            string
}

export interface AppointmentFormProps {
  defaultValues?: AppointmentFormDefaultValues
  onSubmit: (data: AppointmentFormValues) => Promise<void> | void
  isLoading?: boolean
  submitLabel?: string
}

// ─── Patient Search (inner component — must be inside FormProvider) ───────────

function PatientSearchField() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<AppointmentFormValues>()

  const [rawQuery,   setRawQuery]   = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [open,       setOpen]       = useState(false)
  const debounceRef  = useRef<ReturnType<typeof setTimeout>>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)

  const patientName = watch('patientName')
  const error       = errors.patientId?.message as string | undefined

  // usePatientSearch handles caching, deduplication — no direct api call needed
  const { data: results = [], isFetching } = usePatientSearch(debouncedQ)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setRawQuery(val)
    setOpen(true)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedQ(val), 300)
  }

  const selectPatient = (p: { id: string; code: string; firstName: string; lastName: string }) => {
    setValue('patientId',   p.id,                                        { shouldValidate: true })
    setValue('patientName', `${p.firstName} ${p.lastName} (${p.code})`, { shouldValidate: true })
    setRawQuery('')
    setDebouncedQ('')
    setOpen(false)
  }

  const clearPatient = () => {
    setValue('patientId',   '', { shouldValidate: true })
    setValue('patientName', '', { shouldValidate: true })
    setRawQuery('')
    setDebouncedQ('')
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <Label htmlFor="patient-search">
        ผู้ป่วย <span className="text-danger">*</span>
      </Label>

      {patientName ? (
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-caramel-30">
          <User size={14} className="text-espresso shrink-0" />
          <span className="text-sm text-espresso flex-1 truncate">{patientName}</span>
          <button
            type="button"
            onClick={clearPatient}
            className="text-gray-400 hover:text-danger transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <Input
            id="patient-search"
            placeholder="ค้นหาชื่อ นามสกุล หรือ HN..."
            value={rawQuery}
            onChange={handleChange}
            onFocus={() => rawQuery && setOpen(true)}
            className={cn('pl-9', error && 'border-danger focus-visible:ring-danger/30')}
            autoComplete="off"
          />

          {open && (results.length > 0 || isFetching) && (
            <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {isFetching ? (
                <div className="px-4 py-3 text-sm text-gray-400">กำลังค้นหา...</div>
              ) : (
                results.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onMouseDown={() => selectPatient(p)}
                    className="w-full px-4 py-2.5 text-left hover:bg-caramel-30 transition-colors flex items-center gap-3"
                  >
                    <span className="text-xs bg-copper-30 text-espresso rounded px-1.5 py-0.5 font-mono shrink-0">
                      {p.code}
                    </span>
                    <span className="text-sm text-gray-800">
                      {p.firstName} {p.lastName}
                    </span>
                    {p.phone && (
                      <span className="text-xs text-gray-400 ml-auto">{p.phone}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}

          {open && !isFetching && rawQuery.length > 0 && results.length === 0 && (
            <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-400">
              ไม่พบผู้ป่วยที่ค้นหา
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

// ─── Time field ───────────────────────────────────────────────────────────────

function TimeField() {
  const { control, formState: { errors } } = useFormContext<AppointmentFormValues>()
  const error = errors.time?.message as string | undefined

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="appt-time">
        เวลา <span className="text-danger">*</span>
      </Label>
      <Controller
        name="time"
        control={control}
        render={({ field }) => (
          <Input
            id="appt-time"
            type="time"
            value={field.value ?? ''}
            onChange={field.onChange}
            className={cn(error && 'border-danger focus-visible:ring-danger/30')}
          />
        )}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

// ─── Main Form Component ──────────────────────────────────────────────────────

export function AppointmentForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'จองนัด',
}: AppointmentFormProps) {
  const { data: doctors  = [] } = useDoctors()
  const { data: services = [] } = useServices()

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientId:       defaultValues?.patientId       ?? '',
      patientName:     defaultValues?.patientName     ?? '',
      staffId:         defaultValues?.staffId         ?? '',
      serviceId:       defaultValues?.serviceId       ?? '',
      date:            defaultValues?.date            ?? '',
      time:            defaultValues?.time            ?? '09:00',
      durationMinutes: defaultValues?.durationMinutes ?? '30',
      soldAt:          defaultValues?.soldAt          ?? new Date().toISOString().slice(0, 10),
      note:            defaultValues?.note            ?? '',
    },
  })

  const doctorOptions = [
    { label: 'ไม่ระบุ', value: '' },
    ...doctors.map((d) => ({ label: `${d.firstName} ${d.lastName}`, value: d.id })),
  ]

  const serviceOptions = [
    { label: 'ไม่ระบุ', value: '' },
    ...services.map((s) => ({ label: s.name, value: s.id })),
  ]

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <PatientSearchField />

        <FormSelect
          name="staffId"
          label="แพทย์ผู้รักษา"
          options={doctorOptions}
          placeholder="เลือกแพทย์ (ถ้ามี)"
        />

        <FormSelect
          name="serviceId"
          label="บริการ"
          options={serviceOptions}
          placeholder="เลือกบริการ (ถ้ามี)"
        />

        <div className="grid grid-cols-2 gap-3">
          <FormDatePicker name="date" label="วันที่นัด" required />
          <TimeField />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormSelect
            name="durationMinutes"
            label="ระยะเวลา"
            options={[
              { label: '15 นาที', value: '15' },
              { label: '30 นาที', value: '30' },
              { label: '45 นาที', value: '45' },
              { label: '1 ชั่วโมง', value: '60' },
              { label: '1.5 ชั่วโมง', value: '90' },
              { label: '2 ชั่วโมง', value: '120' },
            ]}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              วันที่จอง{' '}
              <span className="text-xs text-gray-400 font-normal">(ย้อนหลังได้)</span>
            </label>
            <Controller
              name="soldAt"
              control={form.control}
              render={({ field }) => (
                <input
                  type="date"
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  max={new Date().toISOString().slice(0, 10)}
                  className="h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-copper/30 focus:border-copper"
                />
              )}
            />
          </div>
        </div>

        <FormTextarea
          name="note"
          label="หมายเหตุ"
          placeholder="บันทึกเพิ่มเติม เช่น อาการ, คำร้องขอพิเศษ..."
          rows={3}
        />

        <div className="flex justify-end pt-1">
          <AppButton type="submit" loading={isLoading} className="min-w-28">
            {isLoading ? 'กำลังบันทึก...' : submitLabel}
          </AppButton>
        </div>
      </form>
    </FormProvider>
  )
}

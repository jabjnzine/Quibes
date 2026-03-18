'use client'

import { useState } from 'react'
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'

import { FormInput } from '@/components/forms/form-input'
import { FormSelect } from '@/components/forms/form-select'
import { FormDatePicker } from '@/components/forms/form-date-picker'
import { FormTextarea } from '@/components/forms/form-textarea'
import { AppButton } from '@/components/app/app-button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Gender } from '@quibes/shared'

// ─── Schema ───────────────────────────────────────────────────────────────────

const patientSchema = z.object({
  firstName: z.string().min(1, 'กรุณากรอกชื่อ'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'กรุณาเลือกเพศ' }),
  }),
  dob: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^[0-9]{9,10}$/.test(v), 'เบอร์โทรไม่ถูกต้อง (9-10 หลัก)'),
  nationalId: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{13}$/.test(v), 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก'),
  allergy: z.string().optional(),
  medicalHistory: z.string().optional(),
})

export type PatientFormValues = z.infer<typeof patientSchema>

// ─── Options ──────────────────────────────────────────────────────────────────

const GENDER_OPTIONS = [
  { label: 'ชาย', value: Gender.MALE },
  { label: 'หญิง', value: Gender.FEMALE },
  { label: 'อื่นๆ', value: Gender.OTHER },
]

const TODAY = new Date().toISOString().split('T')[0]

// ─── Component ────────────────────────────────────────────────────────────────

// ─── National ID field with show/hide toggle ─────────────────────────────────

function NationalIdField() {
  const [show, setShow] = useState(false)
  const { control, formState: { errors } } = useFormContext<PatientFormValues>()
  const error = errors.nationalId?.message as string | undefined

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="nationalId">เลขบัตรประชาชน</Label>
      <div className="relative">
        <Controller
          name="nationalId"
          control={control}
          render={({ field }) => (
            <Input
              id="nationalId"
              type={show ? 'text' : 'password'}
              inputMode="numeric"
              maxLength={13}
              placeholder="กรอกเลข 13 หลัก"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 13))}
              className={cn('pr-10', error && 'border-danger focus-visible:ring-danger/30')}
              autoComplete="off"
            />
          )}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
          aria-label={show ? 'ซ่อน' : 'แสดง'}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      <p className="text-xs text-gray-400">ข้อมูลนี้จะถูกเข้ารหัสก่อนบันทึก</p>
    </div>
  )
}

interface PatientFormProps {
  defaultValues?: Partial<PatientFormValues>
  onSubmit: (data: PatientFormValues) => void | Promise<void>
  isLoading?: boolean
  submitLabel?: string
}

export function PatientForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = 'บันทึก',
}: PatientFormProps) {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName:     '',
      lastName:      '',
      gender:        undefined,
      dob:           '',
      phone:         '',
      nationalId:    '',
      allergy:       '',
      medicalHistory: '',
      ...defaultValues,
    },
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput name="firstName" label="ชื่อ" placeholder="ชื่อจริง" required />
          <FormInput name="lastName" label="นามสกุล" placeholder="นามสกุล" required />
        </div>

        {/* Gender + DOB row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            name="gender"
            label="เพศ"
            options={GENDER_OPTIONS}
            placeholder="เลือกเพศ"
            required
          />
          <FormDatePicker
            name="dob"
            label="วันเกิด"
            maxDate={TODAY}
            helperText="วัน/เดือน/ปี ค.ศ."
          />
        </div>

        {/* Phone + National ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            name="phone"
            label="เบอร์โทรศัพท์"
            type="tel"
            placeholder="0812345678"
          />
          <NationalIdField />
        </div>

        {/* Medical info */}
        <FormTextarea
          name="allergy"
          label="ประวัติแพ้ยา / แพ้อาหาร"
          rows={2}
          placeholder="ระบุสิ่งที่แพ้ หรือ '-' หากไม่มี"
        />
        <FormTextarea
          name="medicalHistory"
          label="ประวัติโรคประจำตัว"
          rows={3}
          placeholder="ระบุโรคประจำตัว เช่น เบาหวาน ความดัน หรือ '-' หากไม่มี"
        />

        {/* Submit */}
        <div className="pt-1 border-t border-gray-100">
          <AppButton type="submit" loading={isLoading} className="w-full sm:w-auto sm:min-w-32">
            {isLoading ? 'กำลังบันทึก...' : submitLabel}
          </AppButton>
        </div>
      </form>
    </FormProvider>
  )
}

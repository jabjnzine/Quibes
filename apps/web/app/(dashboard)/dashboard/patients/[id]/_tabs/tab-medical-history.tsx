'use client'

import { useState } from 'react'
import { Pencil, AlertCircle, FileText, Info } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Patient } from '@quibes/shared'
import { useUpdatePatient } from '@/hooks/use-patients'
import { AppButton, AppSheet } from '@/components/app'
import { FormTextarea } from '@/components/forms/form-textarea'
import { showToast } from '@/lib/toast'
import { getApiMessage } from '@/lib/errors'

const schema = z.object({
  allergy:        z.string().optional(),
  medicalHistory: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

function Section({
  icon: Icon,
  iconClass,
  title,
  content,
  emptyText,
}: {
  icon: React.ElementType
  iconClass: string
  title: string
  content?: string
  emptyText: string
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconClass}`}>
          <Icon size={14} />
        </div>
        <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
      </div>
      {content ? (
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line pl-9">
          {content}
        </p>
      ) : (
        <p className="text-sm text-gray-300 italic pl-9">{emptyText}</p>
      )}
    </div>
  )
}

interface TabMedicalHistoryProps {
  patient: Patient
}

export function TabMedicalHistory({ patient }: TabMedicalHistoryProps) {
  const [editOpen, setEditOpen] = useState(false)
  const update = useUpdatePatient(patient.id)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      allergy:        patient.allergy ?? '',
      medicalHistory: patient.medicalHistory ?? '',
    },
  })

  // Re-sync when patient changes
  const handleEdit = () => {
    form.reset({
      allergy:        patient.allergy ?? '',
      medicalHistory: patient.medicalHistory ?? '',
    })
    setEditOpen(true)
  }

  const onSubmit = async (values: FormValues) => {
    try {
      await update.mutateAsync(values)
      showToast('อัปเดตประวัติเรียบร้อย', 'success')
      setEditOpen(false)
    } catch (error) {
      showToast(getApiMessage(error), 'error')
    }
  }

  return (
    <div className="space-y-4">
      {/* Action */}
      <div className="flex justify-end">
        <AppButton
          variant="outline"
          size="sm"
          leftIcon={<Pencil size={14} />}
          onClick={handleEdit}
        >
          แก้ไขประวัติ
        </AppButton>
      </div>

      {/* Content */}
      <div className="grid gap-4">
        <Section
          icon={AlertCircle}
          iconClass="bg-warning/10 text-warning"
          title="ประวัติการแพ้ยา / แพ้อาหาร"
          content={patient.allergy}
          emptyText="ไม่มีประวัติการแพ้"
        />
        <Section
          icon={FileText}
          iconClass="bg-info/10 text-info"
          title="โรคประจำตัว"
          content={patient.medicalHistory}
          emptyText="ไม่มีประวัติโรคประจำตัว"
        />
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
          <div className="flex items-start gap-2 text-xs text-gray-400">
            <Info size={13} className="mt-0.5 shrink-0" />
            <p>
              ข้อมูลด้านบนเป็นข้อมูลทางการแพทย์ที่สำคัญ
              กรุณาตรวจสอบความถูกต้องก่อนทุกครั้งที่ให้บริการ
            </p>
          </div>
        </div>
      </div>

      {/* Edit Sheet */}
      <AppSheet open={editOpen} onClose={setEditOpen} title="แก้ไขประวัติสุขภาพ" size="sm">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormTextarea
              name="allergy"
              label="ประวัติการแพ้ยา / แพ้อาหาร"
              rows={3}
              placeholder="ระบุยา อาหาร หรือสารที่แพ้ หรือ '-' หากไม่มี"
            />
            <FormTextarea
              name="medicalHistory"
              label="โรคประจำตัว"
              rows={4}
              placeholder="เช่น เบาหวาน, ความดันโลหิตสูง, โรคหัวใจ หรือ '-' หากไม่มี"
            />
            <div className="pt-2 border-t border-gray-100">
              <AppButton type="submit" loading={update.isPending} className="w-full">
                บันทึกการเปลี่ยนแปลง
              </AppButton>
            </div>
          </form>
        </FormProvider>
      </AppSheet>
    </div>
  )
}

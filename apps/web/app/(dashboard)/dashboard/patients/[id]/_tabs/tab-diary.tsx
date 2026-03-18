'use client'

import { useState } from 'react'
import { Plus, BookText, Pencil } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  usePatientDiary,
  useCreateDiaryEntry,
  useUpdateDiaryEntry,
  type CreateDiaryDto,
} from '@/hooks/use-patient-detail'
import type { PatientDiary } from '@quibes/shared'
import { AppButton, AppSheet, AppSkeleton } from '@/components/app'
import { FormTextarea } from '@/components/forms/form-textarea'
import { FormDatePicker } from '@/components/forms/form-date-picker'
import { showToast } from '@/lib/toast'
import { getApiMessage } from '@/lib/errors'

const schema = z.object({
  note:       z.string().min(1, 'กรุณากรอกบันทึก'),
  recordedAt: z.string().min(1, 'กรุณาระบุวันที่'),
})
type DiaryFormValues = z.infer<typeof schema>

function DiaryForm({
  defaultValues,
  onSubmit,
  isLoading,
}: {
  defaultValues?: Partial<DiaryFormValues>
  onSubmit: (v: DiaryFormValues) => void
  isLoading: boolean
}) {
  const form = useForm<DiaryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      note: '',
      recordedAt: new Date().toISOString().slice(0, 10),
      ...defaultValues,
    },
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormDatePicker
          name="recordedAt"
          label="วันที่บันทึก"
          required
          maxDate={new Date().toISOString().slice(0, 10)}
        />
        <FormTextarea
          name="note"
          label="บันทึกการติดตามผล"
          required
          rows={5}
          placeholder="ระบุบันทึก เช่น ผลการรักษา การตอบสนองต่อยา สิ่งที่ควรติดตาม..."
        />
        <div className="pt-2 border-t border-gray-100">
          <AppButton type="submit" loading={isLoading} className="w-full">
            บันทึก
          </AppButton>
        </div>
      </form>
    </FormProvider>
  )
}

interface TabDiaryProps {
  patientId: string
  enabled: boolean
}

export function TabDiary({ patientId, enabled }: TabDiaryProps) {
  const [addOpen, setAddOpen]   = useState(false)
  const [editing, setEditing]   = useState<PatientDiary | null>(null)

  const { data, isLoading } = usePatientDiary(patientId, enabled)
  const createMutation = useCreateDiaryEntry(patientId)
  const updateMutation = useUpdateDiaryEntry(patientId, editing?.id ?? '')

  const handleCreate = async (values: CreateDiaryDto) => {
    try {
      await createMutation.mutateAsync(values)
      showToast('บันทึก Diary เรียบร้อย', 'success')
      setAddOpen(false)
    } catch (error) {
      showToast(getApiMessage(error), 'error')
    }
  }

  const handleUpdate = async (values: CreateDiaryDto) => {
    try {
      await updateMutation.mutateAsync(values)
      showToast('อัปเดต Diary เรียบร้อย', 'success')
      setEditing(null)
    } catch (error) {
      showToast(getApiMessage(error), 'error')
    }
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('th-TH', {
      weekday: 'short',
      day:     'numeric',
      month:   'long',
      year:    'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-xl border border-gray-100 p-4">
            <AppSkeleton.Bone className="h-3 w-32" />
            <AppSkeleton.Bone className="h-3.5 w-full" />
            <AppSkeleton.Bone className="h-3.5 w-4/5" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex justify-end">
        <AppButton leftIcon={<Plus size={15} />} size="sm" onClick={() => setAddOpen(true)}>
          เพิ่มบันทึก
        </AppButton>
      </div>

      {/* Timeline */}
      {!data?.length ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <BookText size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">ยังไม่มีบันทึก</p>
        </div>
      ) : (
        <div className="relative space-y-0 pl-6 border-l-2 border-gray-100">
          {data.map((entry) => (
            <div key={entry.id} className="relative pb-6 last:pb-0 group">
              {/* Timeline dot */}
              <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-caramel-30 border-2 border-caramel-60" />

              <div className="rounded-xl border border-gray-100 bg-white p-4 hover:border-caramel-60 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-medium text-copper">
                    {formatDate(entry.recordedAt)}
                  </span>
                  <button
                    onClick={() => setEditing(entry)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-copper"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {entry.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Sheet */}
      <AppSheet open={addOpen} onClose={setAddOpen} title="เพิ่มบันทึก" size="sm">
        <DiaryForm onSubmit={handleCreate} isLoading={createMutation.isPending} />
      </AppSheet>

      {/* Edit Sheet */}
      <AppSheet
        open={!!editing}
        onClose={(v) => !v && setEditing(null)}
        title="แก้ไขบันทึก"
        size="sm"
      >
        {editing && (
          <DiaryForm
            defaultValues={{
              note:       editing.note,
              recordedAt: editing.recordedAt.slice(0, 10),
            }}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
          />
        )}
      </AppSheet>
    </div>
  )
}

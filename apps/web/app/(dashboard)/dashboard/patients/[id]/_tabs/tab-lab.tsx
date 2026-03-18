'use client'

import { useState } from 'react'
import { Plus, FlaskConical } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePatientLabResults, useCreateLabResult } from '@/hooks/use-patient-detail'
import { AppButton, AppDialog, AppSkeleton } from '@/components/app'
import { FormInput } from '@/components/forms/form-input'
import { FormDatePicker } from '@/components/forms/form-date-picker'
import { showToast } from '@/lib/toast'
import { getApiMessage } from '@/lib/errors'

const schema = z.object({
  testName:  z.string().min(1, 'กรุณาระบุชื่อการทดสอบ'),
  result:    z.string().min(1, 'กรุณาระบุผลการทดสอบ'),
  unit:      z.string().optional(),
  refRange:  z.string().optional(),
  testedAt:  z.string().min(1, 'กรุณาระบุวันที่'),
})
type LabFormValues = z.infer<typeof schema>

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface TabLabProps {
  patientId: string
  enabled: boolean
}

export function TabLab({ patientId, enabled }: TabLabProps) {
  const [addOpen, setAddOpen] = useState(false)
  const { data, isLoading } = usePatientLabResults(patientId, enabled)
  const create = useCreateLabResult(patientId)

  const form = useForm<LabFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { testedAt: new Date().toISOString().slice(0, 10) },
  })

  const onSubmit = async (values: LabFormValues) => {
    try {
      await create.mutateAsync(values)
      showToast('บันทึกผล LAB เรียบร้อย', 'success')
      setAddOpen(false)
      form.reset()
    } catch (error) {
      showToast(getApiMessage(error), 'error')
    }
  }

  if (isLoading) return <AppSkeleton.Table rows={4} />

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex justify-end">
        <AppButton leftIcon={<Plus size={15} />} size="sm" onClick={() => setAddOpen(true)}>
          เพิ่มผล LAB
        </AppButton>
      </div>

      {/* Table */}
      {!data?.length ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <FlaskConical size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">ยังไม่มีผล LAB</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-3 font-medium text-gray-500">การทดสอบ</th>
                <th className="px-4 py-3 font-medium text-gray-500">ผล</th>
                <th className="px-4 py-3 font-medium text-gray-500">หน่วย</th>
                <th className="px-4 py-3 font-medium text-gray-500">ค่าอ้างอิง</th>
                <th className="px-4 py-3 font-medium text-gray-500 whitespace-nowrap">วันที่ทดสอบ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-800">{item.testName}</td>
                  <td className="px-4 py-3 text-gray-800">{item.result}</td>
                  <td className="px-4 py-3 text-gray-500">{item.unit ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                    {item.refRange ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {formatDate(item.testedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Dialog */}
      <AppDialog
        open={addOpen}
        onClose={setAddOpen}
        title="เพิ่มผล LAB"
        description="บันทึกผลการตรวจทางห้องปฏิบัติการ"
        size="sm"
      >
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput name="testName" label="ชื่อการทดสอบ" required placeholder="เช่น CBC, FBS, HbA1c" />
            <div className="grid grid-cols-2 gap-3">
              <FormInput name="result"   label="ผลการทดสอบ" required placeholder="เช่น 5.8" />
              <FormInput name="unit"     label="หน่วย"       placeholder="เช่น mg/dL" />
            </div>
            <FormInput name="refRange"  label="ค่าอ้างอิง"  placeholder="เช่น 70-100" />
            <FormDatePicker
              name="testedAt"
              label="วันที่ทดสอบ"
              required
              maxDate={new Date().toISOString().slice(0, 10)}
            />
            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <AppButton type="submit" size="sm" loading={create.isPending}>
                บันทึก
              </AppButton>
            </div>
          </form>
        </FormProvider>
      </AppDialog>
    </div>
  )
}

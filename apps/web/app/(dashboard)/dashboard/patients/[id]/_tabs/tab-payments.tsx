'use client'

import { Receipt as ReceiptIcon } from 'lucide-react'
import { usePatientReceipts } from '@/hooks/use-patient-detail'
import { AppBadge, AppSkeleton, PAYMENT_STATUS_LABEL } from '@/components/app'
import { PaymentMethod } from '@quibes/shared'

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]:        'เงินสด',
  [PaymentMethod.CREDIT_CARD]: 'บัตรเครดิต',
  [PaymentMethod.TRANSFER]:    'โอนเงิน',
  [PaymentMethod.QR_CODE]:     'QR Code',
  [PaymentMethod.DEPOSIT]:     'เงินมัดจำ',
  [PaymentMethod.MIXED]:       'หลายช่องทาง',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatBaht(n: number) {
  return n.toLocaleString('th-TH', { minimumFractionDigits: 2 })
}

interface TabPaymentsProps {
  patientId: string
  enabled: boolean
}

export function TabPayments({ patientId, enabled }: TabPaymentsProps) {
  const { data, isLoading } = usePatientReceipts(patientId, enabled)

  if (isLoading) return <AppSkeleton.Table rows={4} />

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <ReceiptIcon size={20} className="text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">ยังไม่มีประวัติการชำระเงิน</p>
      </div>
    )
  }

  const totalPaid = data
    .filter((r) => r.status === 'paid')
    .reduce((sum, r) => sum + r.total, 0)

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="rounded-xl border border-caramel-60 bg-caramel-30 px-5 py-3 flex items-center justify-between">
        <span className="text-sm text-espresso">ยอดชำระทั้งหมด</span>
        <span className="font-display font-bold text-copper text-xl">
          ฿{formatBaht(totalPaid)}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left">
              <th className="px-4 py-3 font-medium text-gray-500 whitespace-nowrap">วันที่</th>
              <th className="px-4 py-3 font-medium text-gray-500">ช่องทาง</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-right">ส่วนลด</th>
              <th className="px-4 py-3 font-medium text-gray-500 text-right">ยอดรวม</th>
              <th className="px-4 py-3 font-medium text-gray-500">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((receipt) => {
              const { label, variant } = PAYMENT_STATUS_LABEL[receipt.status] ?? {
                label: receipt.status, variant: 'default' as const,
              }
              return (
                <tr key={receipt.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {formatDate(receipt.paidAt ?? receipt.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {PAYMENT_METHOD_LABEL[receipt.paymentMethod] ?? receipt.paymentMethod}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">
                    {receipt.discount > 0 ? `-฿${formatBaht(receipt.discount)}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">
                    ฿{formatBaht(receipt.total)}
                  </td>
                  <td className="px-4 py-3">
                    <AppBadge variant={variant}>{label}</AppBadge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

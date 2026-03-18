import type { Metadata } from 'next'
import AppointmentsClient from './appointments-client'

export const metadata: Metadata = {
  title: 'นัดหมาย | QUIBES CLINIC',
  description: 'จัดการนัดหมายและตารางแพทย์',
}

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 gap-0 overflow-hidden">
      <AppointmentsClient />
    </div>
  )
}

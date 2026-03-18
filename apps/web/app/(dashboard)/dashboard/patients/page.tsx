import type { Metadata } from 'next'
import { PatientsClient } from './patients-client'

export const metadata: Metadata = { title: 'ผู้ป่วย' }

export default function PatientsPage() {
  return <PatientsClient />
}

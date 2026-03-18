import type { Metadata } from 'next'
import { PatientDetail } from './patient-detail'

// Next.js 16 — params is a Promise, must be awaited
type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `ผู้ป่วย ${id.slice(0, 8)}…` }
}

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params
  return <PatientDetail id={id} />
}

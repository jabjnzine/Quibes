import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Finance' }

export default function FinancePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Finance</h1>
      <p className="text-gray-600">Module under construction...</p>
    </div>
  )
}

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบ',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-4xl text-copper tracking-wide">
            QUIBES
          </h1>
          <p className="font-sans text-sm text-gray-600 mt-1">CLINIC MANAGEMENT SYSTEM</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h2 className="font-sans text-xl font-bold text-gray-800 mb-1">เข้าสู่ระบบ</h2>
          <p className="text-sm text-gray-400 mb-6">กรุณากรอกอีเมลและรหัสผ่านของคุณ</p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} QUIBES CLINIC — All rights reserved
        </p>
      </div>
    </div>
  )
}

'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        // ─── Appointment / OPD status ────────────────────────────────────────
        pending:
          'bg-caramel-30 text-espresso',
        confirmed:
          'bg-info/10 text-info',
        in_progress:
          'bg-copper-30 text-copper',
        done:
          'bg-success/10 text-success',
        cancelled:
          'bg-gray-100 text-gray-400',

        // ─── Payment status ──────────────────────────────────────────────────
        paid:
          'bg-success/10 text-success',
        unpaid:
          'bg-danger/10 text-danger',
        partial:
          'bg-warning/10 text-warning',

        // ─── Course / Member ─────────────────────────────────────────────────
        course:
          'bg-mocha-30 text-mocha',
        active:
          'bg-success/10 text-success',
        expired:
          'bg-gray-100 text-gray-400',

        // ─── Generic ─────────────────────────────────────────────────────────
        default:
          'bg-gray-100 text-gray-600',
        olive:
          'bg-olive/10 text-olive',
        warning:
          'bg-warning/10 text-warning',
        danger:
          'bg-danger/10 text-danger',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface AppBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function AppBadge({ variant, className, ...props }: AppBadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

// ─── Convenient label maps for each status domain ────────────────────────────

export const APPOINTMENT_STATUS_LABEL: Record<string, { label: string; variant: AppBadgeProps['variant'] }> = {
  pending:     { label: 'รอยืนยัน',    variant: 'pending' },
  confirmed:   { label: 'ยืนยันแล้ว',  variant: 'confirmed' },
  in_progress: { label: 'กำลังรักษา', variant: 'in_progress' },
  done:        { label: 'เสร็จสิ้น',   variant: 'done' },
  cancelled:   { label: 'ยกเลิก',      variant: 'cancelled' },
}

export const PAYMENT_STATUS_LABEL: Record<string, { label: string; variant: AppBadgeProps['variant'] }> = {
  pending:  { label: 'รอชำระ',     variant: 'unpaid' },
  paid:     { label: 'ชำระแล้ว',   variant: 'paid' },
  partial:  { label: 'ชำระบางส่วน', variant: 'partial' },
  cancelled: { label: 'ยกเลิก',    variant: 'cancelled' },
}

export const COURSE_STATUS_LABEL: Record<string, { label: string; variant: AppBadgeProps['variant'] }> = {
  active:    { label: 'ใช้งานอยู่',  variant: 'active' },
  completed: { label: 'ครบแล้ว',    variant: 'done' },
  expired:   { label: 'หมดอายุ',    variant: 'expired' },
  cancelled: { label: 'ยกเลิก',     variant: 'cancelled' },
}

export const VIAL_STATUS_LABEL: Record<string, { label: string; variant: AppBadgeProps['variant'] }> = {
  active:   { label: 'เปิดใช้งาน', variant: 'active' },
  expired:  { label: 'หมดอายุ',   variant: 'expired' },
  disposed: { label: 'ทิ้งแล้ว',  variant: 'cancelled' },
}

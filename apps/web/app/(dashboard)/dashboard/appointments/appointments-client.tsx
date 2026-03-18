'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'
import { Plus, ChevronLeft, ChevronRight, CalendarDays, List } from 'lucide-react'
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from 'date-fns'
import { th } from 'date-fns/locale'
import type { DatesSetArg, EventDropArg, EventClickArg, DateSelectArg } from '@fullcalendar/core'
import { AppointmentStatus } from '@quibes/shared'
import {
  useAppointmentCalendar,
  useCreateAppointment,
  usePatchAppointment,
  usePatchAppointmentStatus,
  useDeleteAppointment,
  useDoctors,
  type CalendarEvent,
} from '@/hooks/use-appointments'
import { useUIStore } from '@/stores/ui.store'
import { AppButton } from '@/components/app/app-button'
import { AppBadge } from '@/components/app/app-badge'
import { AppDialog } from '@/components/app/app-dialog'
import { AppSheet } from '@/components/app/app-sheet'
import { AppAlert } from '@/components/app/app-alert'
import { TableSkeleton } from '@/components/app/app-skeleton'
import { AppointmentForm, type AppointmentFormValues } from '@/components/forms/appointment-form'
import { cn } from '@/lib/utils'
import type { CalendarViewProps } from './calendar-view'

// ─── FullCalendar — loaded only on client side (avoids SSR mismatch) ─────────

const CalendarView = dynamic<CalendarViewProps>(() => import('./calendar-view'), {
  ssr: false,
  loading: () => <div className="p-4"><TableSkeleton rows={5} /></div>,
})

// ─── Status → color mapping ────────────────────────────────────────────────────

export const STATUS_BG: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]:     '#EDE3CE',
  [AppointmentStatus.CONFIRMED]:   '#8C8C78',
  [AppointmentStatus.IN_PROGRESS]: '#CDA080',
  [AppointmentStatus.DONE]:        '#4CAF7D',
  [AppointmentStatus.CANCELLED]:   '#E0D9D0',
}

export const STATUS_TEXT: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]:     '#643C28',
  [AppointmentStatus.CONFIRMED]:   '#ffffff',
  [AppointmentStatus.IN_PROGRESS]: '#643C28',
  [AppointmentStatus.DONE]:        '#ffffff',
  [AppointmentStatus.CANCELLED]:   '#6B6259',
}

// ─── Status filter config ──────────────────────────────────────────────────────

const STATUS_FILTERS: { label: string; value: AppointmentStatus | 'all' }[] = [
  { label: 'ทั้งหมด',     value: 'all' },
  { label: 'รอยืนยัน',   value: AppointmentStatus.PENDING },
  { label: 'ยืนยันแล้ว', value: AppointmentStatus.CONFIRMED },
  { label: 'กำลังรักษา', value: AppointmentStatus.IN_PROGRESS },
  { label: 'เสร็จสิ้น',  value: AppointmentStatus.DONE },
  { label: 'ยกเลิก',     value: AppointmentStatus.CANCELLED },
]

// ─── Detail Sheet ──────────────────────────────────────────────────────────────

interface DetailSheetProps {
  event:          CalendarEvent | null
  open:           boolean
  onClose:        () => void
  onDelete:       (id: string) => void
  onStatusChange: (id: string, status: AppointmentStatus) => void
}

function AppointmentDetailSheet({
  event, open, onClose, onDelete, onStatusChange,
}: DetailSheetProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const patchStatus = usePatchAppointmentStatus()

  if (!event) return null

  const NEXT_STATUS: Partial<Record<AppointmentStatus, { label: string; next: AppointmentStatus }>> = {
    [AppointmentStatus.PENDING]:     { label: 'ยืนยันนัด',  next: AppointmentStatus.CONFIRMED },
    [AppointmentStatus.CONFIRMED]:   { label: 'เริ่มรักษา', next: AppointmentStatus.IN_PROGRESS },
    [AppointmentStatus.IN_PROGRESS]: { label: 'เสร็จสิ้น',  next: AppointmentStatus.DONE },
  }
  const next = NEXT_STATUS[event.status]

  return (
    <>
      <AppSheet open={open} onClose={onClose} title="รายละเอียดนัดหมาย" size="md">
        <div className="flex flex-col gap-5 py-2">
          {/* Patient card */}
          <div className="bg-caramel-30 rounded-xl p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-copper flex items-center justify-center text-white font-display font-bold text-sm shrink-0">
              {event.patientName?.charAt(0) ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-gray-800 text-base truncate">
                {event.patientName}
              </p>
              <p className="text-xs text-gray-500 font-mono">{event.patientCode}</p>
            </div>
            <AppBadge variant={event.status as Parameters<typeof AppBadge>[0]['variant']} />
          </div>

          {/* Info rows */}
          <div className="flex flex-col gap-3">
            <InfoRow
              label="วันและเวลา"
              value={format(new Date(event.start), 'EEEE d MMMM yyyy — HH:mm น.', { locale: th })}
            />
            <InfoRow label="สิ้นสุด" value={format(new Date(event.end), 'HH:mm น.', { locale: th })} />
            <InfoRow label="แพทย์"   value={event.staffName ?? 'ไม่ระบุ'} />
            {event.note && <InfoRow label="หมายเหตุ" value={event.note} />}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {next && (
              <AppButton
                size="sm"
                loading={patchStatus.isPending}
                onClick={() => { onStatusChange(event.id, next.next); onClose() }}
              >
                {next.label}
              </AppButton>
            )}
            {event.status !== AppointmentStatus.CANCELLED &&
              event.status !== AppointmentStatus.DONE && (
              <AppButton
                size="sm"
                variant="outline"
                onClick={() => { onStatusChange(event.id, AppointmentStatus.CANCELLED); onClose() }}
              >
                ยกเลิกนัด
              </AppButton>
            )}
            <AppButton
              size="sm"
              variant="danger"
              className="ml-auto"
              onClick={() => setConfirmDelete(true)}
            >
              ลบ
            </AppButton>
          </div>
        </div>
      </AppSheet>

      <AppAlert
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => { onDelete(event.id); setConfirmDelete(false); onClose() }}
        title="ลบนัดหมาย?"
        description={`นัดหมายของ "${event.patientName}" จะถูกลบออกจากระบบ`}
        confirmLabel="ลบนัด"
        variant="danger"
      />
    </>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  )
}

// ─── Main client component ─────────────────────────────────────────────────────

export default function AppointmentsClient() {
  const addToast = useUIStore((s) => s.addToast)

  // ─── View + navigation state ─────────────────────────────────────────────────
  const [view,        setView]        = useState<'timeGridDay' | 'timeGridWeek'>('timeGridWeek')
  const [currentDate, setCurrentDate] = useState(new Date())

  // ─── Filters ─────────────────────────────────────────────────────────────────
  const [filterStatus,  setFilterStatus]  = useState<AppointmentStatus | 'all'>('all')
  const [filterStaffId, setFilterStaffId] = useState('')

  // ─── Dialog / Sheet ───────────────────────────────────────────────────────────
  const [bookingOpen,    setBookingOpen]    = useState(false)
  const [bookingDefault, setBookingDefault] = useState<{ date?: string; time?: string }>({})
  const [detailEvent,    setDetailEvent]    = useState<CalendarEvent | null>(null)
  const [detailOpen,     setDetailOpen]     = useState(false)

  // ─── Calendar range based on current date + view ─────────────────────────────
  const rangeStart = view === 'timeGridWeek'
    ? startOfWeek(currentDate, { weekStartsOn: 1 })
    : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0)
  const rangeEnd = view === 'timeGridWeek'
    ? endOfWeek(currentDate, { weekStartsOn: 1 })
    : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59)

  const calParams = {
    start:   rangeStart.toISOString(),
    end:     rangeEnd.toISOString(),
    ...(filterStatus !== 'all' && { status:  filterStatus }),
    ...(filterStaffId           && { staffId: filterStaffId }),
  }

  const { data: events = [], isLoading } = useAppointmentCalendar(calParams)
  const { data: doctors = [] }            = useDoctors()
  const createAppt  = useCreateAppointment()
  const patchAppt   = usePatchAppointment()
  const patchStatus = usePatchAppointmentStatus()
  const deleteAppt  = useDeleteAppointment()

  // ─── Navigation ───────────────────────────────────────────────────────────────
  const goToToday = () => setCurrentDate(new Date())
  const goPrev    = () => setCurrentDate((d) =>
    view === 'timeGridWeek' ? subWeeks(d, 1) : subDays(d, 1),
  )
  const goNext    = () => setCurrentDate((d) =>
    view === 'timeGridWeek' ? addWeeks(d, 1) : addDays(d, 1),
  )

  const titleLabel = view === 'timeGridDay'
    ? format(currentDate, 'EEEE d MMMM yyyy', { locale: th })
    : `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM', { locale: th })} – ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM yyyy', { locale: th })}`

  // ─── Calendar callbacks ───────────────────────────────────────────────────────

  const handleDatesSet = useCallback((arg: DatesSetArg) => {
    setCurrentDate(arg.start)
  }, [])

  const handleEventClick = useCallback((arg: EventClickArg) => {
    const found = events.find((e) => e.id === arg.event.id) ?? null
    setDetailEvent(found)
    setDetailOpen(true)
  }, [events])

  const handleDateSelect = useCallback((arg: DateSelectArg) => {
    setBookingDefault({
      date: format(arg.start, 'yyyy-MM-dd'),
      time: format(arg.start, 'HH:mm'),
    })
    setBookingOpen(true)
  }, [])

  const handleEventDrop = useCallback(async (arg: EventDropArg) => {
    try {
      await patchAppt.mutateAsync({
        id:   arg.event.id,
        data: { scheduledAt: arg.event.start?.toISOString() ?? '' },
      })
      addToast({ type: 'success', message: 'ย้ายนัดหมายเรียบร้อย' })
    } catch {
      arg.revert()
      addToast({ type: 'error', message: 'ไม่สามารถย้ายนัดหมายได้' })
    }
  }, [patchAppt, addToast])

  const handleBookingSubmit = useCallback(async (values: AppointmentFormValues) => {
    try {
      const scheduledAt = new Date(`${values.date}T${values.time}:00`).toISOString()
      await createAppt.mutateAsync({
        patientId:       values.patientId,
        staffId:         values.staffId   || undefined,
        serviceId:       values.serviceId || undefined,
        scheduledAt,
        durationMinutes: values.durationMinutes ? Number(values.durationMinutes) : 30,
        soldAt:          values.soldAt    || undefined,
        note:            values.note      || undefined,
      })
      setBookingOpen(false)
      addToast({ type: 'success', message: 'จองนัดหมายเรียบร้อย' })
    } catch {
      addToast({ type: 'error', message: 'ไม่สามารถจองนัดหมายได้' })
    }
  }, [createAppt, addToast])

  const handleStatusChange = useCallback(async (id: string, status: AppointmentStatus) => {
    try {
      await patchStatus.mutateAsync({ id, status })
      addToast({ type: 'success', message: 'อัปเดตสถานะเรียบร้อย' })
    } catch {
      addToast({ type: 'error', message: 'ไม่สามารถอัปเดตสถานะได้' })
    }
  }, [patchStatus, addToast])

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteAppt.mutateAsync(id)
      addToast({ type: 'success', message: 'ลบนัดหมายเรียบร้อย' })
    } catch {
      addToast({ type: 'error', message: 'ไม่สามารถลบนัดหมายได้' })
    }
  }, [deleteAppt, addToast])

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl text-gray-800">นัดหมาย</h1>
        <AppButton
          leftIcon={<Plus size={16} />}
          onClick={() => { setBookingDefault({}); setBookingOpen(true) }}
        >
          จองนัดใหม่
        </AppButton>
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white border border-gray-200 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
          >
            วันนี้
          </button>
          <button onClick={goPrev} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <button onClick={goNext} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
            <ChevronRight size={16} className="text-gray-600" />
          </button>
          <span className="text-sm font-medium text-gray-800 ml-1">{titleLabel}</span>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView('timeGridWeek')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
              view === 'timeGridWeek' ? 'bg-white text-copper shadow-sm' : 'text-gray-500 hover:text-gray-700',
            )}
          >
            <List size={14} /> สัปดาห์
          </button>
          <button
            onClick={() => setView('timeGridDay')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
              view === 'timeGridDay' ? 'bg-white text-copper shadow-sm' : 'text-gray-500 hover:text-gray-700',
            )}
          >
            <CalendarDays size={14} /> วัน
          </button>
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilterStatus(f.value)}
            className={cn(
              'px-3 py-1 text-xs rounded-full border transition-all',
              filterStatus === f.value
                ? 'bg-copper text-white border-copper'
                : 'border-gray-200 text-gray-600 hover:border-copper hover:text-copper bg-white',
            )}
          >
            {f.label}
          </button>
        ))}

        {doctors.length > 0 && (
          <select
            value={filterStaffId}
            onChange={(e) => setFilterStaffId(e.target.value)}
            className="ml-auto h-8 text-xs border border-gray-200 rounded-lg px-2 text-gray-600 focus:outline-none focus:border-copper"
          >
            <option value="">แพทย์ทั้งหมด</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.firstName} {d.lastName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ── Calendar ────────────────────────────────────────────────────────── */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden min-h-0">
        <CalendarView
          view={view}
          currentDate={currentDate}
          events={events}
          isLoading={isLoading}
          onDatesSet={handleDatesSet}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
          onEventDrop={handleEventDrop}
        />
      </div>

      {/* ── Booking Dialog ──────────────────────────────────────────────────── */}
      <AppDialog open={bookingOpen} onClose={setBookingOpen} title="จองนัดหมาย" size="md">
        <AppointmentForm
          defaultValues={bookingDefault}
          onSubmit={handleBookingSubmit}
          isLoading={createAppt.isPending}
        />
      </AppDialog>

      {/* ── Detail Sheet ────────────────────────────────────────────────────── */}
      <AppointmentDetailSheet
        event={detailEvent}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}

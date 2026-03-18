'use client'

/**
 * CalendarView — FullCalendar wrapper loaded only on the client side.
 * Imported via dynamic() in appointments-client.tsx to avoid SSR hydration issues.
 */

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin     from '@fullcalendar/daygrid'
import timeGridPlugin    from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { format } from 'date-fns'
import type {
  DatesSetArg,
  EventDropArg,
  EventClickArg,
  DateSelectArg,
  EventContentArg,
} from '@fullcalendar/core'
import { AppointmentStatus } from '@quibes/shared'
import type { CalendarEvent } from '@/hooks/use-appointments'
import { TableSkeleton } from '@/components/app/app-skeleton'

// ─── Status color palette ─────────────────────────────────────────────────────

const STATUS_BG: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]:     '#EDE3CE',
  [AppointmentStatus.CONFIRMED]:   '#8C8C78',
  [AppointmentStatus.IN_PROGRESS]: '#CDA080',
  [AppointmentStatus.DONE]:        '#4CAF7D',
  [AppointmentStatus.CANCELLED]:   '#E0D9D0',
}

const STATUS_TEXT: Record<AppointmentStatus, string> = {
  [AppointmentStatus.PENDING]:     '#643C28',
  [AppointmentStatus.CONFIRMED]:   '#ffffff',
  [AppointmentStatus.IN_PROGRESS]: '#643C28',
  [AppointmentStatus.DONE]:        '#ffffff',
  [AppointmentStatus.CANCELLED]:   '#6B6259',
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface CalendarViewProps {
  view:          'timeGridDay' | 'timeGridWeek'
  currentDate:   Date
  events:        CalendarEvent[]
  isLoading:     boolean
  onDatesSet:    (arg: DatesSetArg) => void
  onEventClick:  (arg: EventClickArg) => void
  onDateSelect:  (arg: DateSelectArg) => void
  onEventDrop:   (arg: EventDropArg) => void
}

// ─── Event content renderer ───────────────────────────────────────────────────

function EventContent(arg: EventContentArg) {
  const ext = arg.event.extendedProps as CalendarEvent
  return (
    <div className="px-1.5 py-0.5 w-full overflow-hidden leading-tight">
      <p className="text-xs font-semibold truncate">{arg.event.title}</p>
      <p className="text-[10px] opacity-80 truncate">
        {format(arg.event.start!, 'HH:mm')}
        {ext.staffName ? ` · ${ext.staffName.split(' ')[0]}` : ''}
      </p>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CalendarView({
  view,
  currentDate,
  events,
  isLoading,
  onDatesSet,
  onEventClick,
  onDateSelect,
  onEventDrop,
}: CalendarViewProps) {
  if (isLoading) {
    return (
      <div className="p-4">
        <TableSkeleton rows={5} />
      </div>
    )
  }

  const fcEvents = events.map((e) => ({
    id:              e.id,
    title:           e.patientName || 'ไม่ระบุ',
    start:           e.start,
    end:             e.end,
    backgroundColor: STATUS_BG[e.status],
    borderColor:     STATUS_BG[e.status],
    textColor:       STATUS_TEXT[e.status],
    extendedProps:   e,
  }))

  return (
    <div className="h-full fc-quibes">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={view}
        // key forces remount when view or date changes, enabling external navigation
        key={`${view}-${currentDate.toISOString().slice(0, 10)}`}
        initialDate={currentDate}
        headerToolbar={false}
        locale="th"
        firstDay={1}
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        slotDuration="00:30:00"
        height="100%"
        events={fcEvents}
        datesSet={onDatesSet}
        eventClick={onEventClick}
        selectable={true}
        selectMirror={true}
        select={onDateSelect}
        editable={true}
        eventDrop={onEventDrop}
        dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        eventContent={EventContent}
      />
    </div>
  )
}

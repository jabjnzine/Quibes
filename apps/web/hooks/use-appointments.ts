import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AppointmentStatus } from '@quibes/shared'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Appointment {
  id: string
  patientId: string
  staffId: string | null
  serviceId: string | null
  scheduledAt: string
  status: AppointmentStatus
  note: string | null
  createdAt: string
  updatedAt: string
  patient?: {
    id: string
    code: string
    firstName: string
    lastName: string
    phone: string | null
  }
  staff?: {
    id: string
    firstName: string
    lastName: string
    role: string
  } | null
}

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  status: AppointmentStatus
  patientId: string
  patientCode: string
  patientName: string
  staffId: string | null
  staffName: string | null
  serviceId: string | null
  note: string | null
}

export interface QueryAppointmentParams {
  page?: number
  limit?: number
  date?: string
  staffId?: string
  serviceId?: string
  status?: AppointmentStatus
  search?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface CalendarParams {
  start: string
  end: string
  staffId?: string
  status?: AppointmentStatus
}

export interface CreateAppointmentPayload {
  patientId: string
  staffId?: string
  serviceId?: string
  scheduledAt: string
  durationMinutes?: number
  soldAt?: string
  note?: string
}

export interface PatchAppointmentPayload extends Partial<CreateAppointmentPayload> {}

// ─── Supporting data (doctors + services) used by appointment form ────────────

export interface DoctorOption {
  id: string
  firstName: string
  lastName: string
  role: string
}

export interface ServiceOption {
  id: string
  name: string
  durationMinutes?: number
}

/** Doctors only — used in appointment form select */
export function useDoctors() {
  return useQuery({
    queryKey: ['staff', 'doctors'],
    queryFn: () =>
      api
        .get<{ data: DoctorOption[] }>('/staff', { params: { role: 'doctor', limit: 100 } })
        .then((r) => r.data?.data ?? (r.data as unknown as DoctorOption[]) ?? []),
    staleTime: 5 * 60_000, // rarely changes — cache 5 min
  })
}

/** Services list — used in appointment form select */
export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () =>
      api
        .get<{ data: ServiceOption[] }>('/settings/services', { params: { limit: 100 } })
        .then((r) => r.data?.data ?? (r.data as unknown as ServiceOption[]) ?? []),
    staleTime: 5 * 60_000,
  })
}

// ─── Query keys ───────────────────────────────────────────────────────────────

const QUERY_KEY = 'appointments'
const CALENDAR_KEY = 'appointments-calendar'

// ─── Data hooks ───────────────────────────────────────────────────────────────

export function useAppointments(params?: QueryAppointmentParams) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () =>
      api
        .get('/appointments', { params })
        .then((r) => r.data as { data: Appointment[]; meta: Record<string, number> }),
  })
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => api.get(`/appointments/${id}`).then((r) => r.data as Appointment),
    enabled: !!id,
  })
}

/**
 * Calendar events for FullCalendar.
 * `start` and `end` come from FullCalendar's `datesSet` callback.
 */
export function useAppointmentCalendar(params: CalendarParams) {
  return useQuery({
    queryKey: [CALENDAR_KEY, params],
    queryFn: () =>
      api
        .get('/appointments/calendar', { params })
        .then((r) => r.data as CalendarEvent[]),
    enabled: !!params.start && !!params.end,
    staleTime: 30_000,
  })
}

// ─── Mutation hooks ───────────────────────────────────────────────────────────

export function useCreateAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAppointmentPayload) => api.post('/appointments', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      qc.invalidateQueries({ queryKey: [CALENDAR_KEY] })
    },
  })
}

export function usePatchAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PatchAppointmentPayload }) =>
      api.patch(`/appointments/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      qc.invalidateQueries({ queryKey: [CALENDAR_KEY] })
    },
  })
}

export function usePatchAppointmentStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      api.patch(`/appointments/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      qc.invalidateQueries({ queryKey: [CALENDAR_KEY] })
    },
  })
}

export function useDeleteAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/appointments/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      qc.invalidateQueries({ queryKey: [CALENDAR_KEY] })
    },
  })
}

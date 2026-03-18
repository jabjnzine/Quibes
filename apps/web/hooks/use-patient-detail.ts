import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type {
  OpdVisit,
  PatientPhoto,
  PatientCourse,
  LabResult,
  Receipt,
  PatientDiary,
} from '@quibes/shared'

// ─── Enriched types (API returns joined data) ─────────────────────────────────

export interface OpdVisitSummary extends OpdVisit {
  doctorName?: string
  itemCount?: number
  serviceNames?: string[]
}

export interface PatientCourseEnriched extends PatientCourse {
  courseName: string
  remainingSessions: number
  progressPercent: number
}

export interface ReceiptSummary extends Receipt {
  itemCount?: number
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

const keys = {
  opd:      (id: string) => ['patient-opd',      id] as const,
  photos:   (id: string) => ['patient-photos',   id] as const,
  courses:  (id: string) => ['patient-courses',  id] as const,
  lab:      (id: string) => ['patient-lab',      id] as const,
  receipts: (id: string) => ['patient-receipts', id] as const,
  diary:    (id: string) => ['patient-diary',    id] as const,
}

// ─── OPD visits ───────────────────────────────────────────────────────────────

export function usePatientOpdVisits(patientId: string, enabled = true) {
  return useQuery({
    queryKey: keys.opd(patientId),
    queryFn: () =>
      api.get<OpdVisitSummary[]>('/opd/visits', { params: { patientId, sortOrder: 'DESC' } })
        .then((r) => r.data),
    enabled: !!patientId && enabled,
  })
}

// ─── Before / After photos ────────────────────────────────────────────────────

export interface PhotoPair {
  visitId?: string
  before?: PatientPhoto
  after?: PatientPhoto
}

export function usePatientPhotos(patientId: string, enabled = true) {
  return useQuery({
    queryKey: keys.photos(patientId),
    queryFn: async () => {
      const photos = await api
        .get<PatientPhoto[]>(`/patients/${patientId}/photos`)
        .then((r) => r.data)

      // Group by visitId into pairs
      const pairMap = new Map<string, PhotoPair>()
      for (const p of photos) {
        const key = p.visitId ?? `no-visit-${p.id}`
        const existing = pairMap.get(key) ?? { visitId: p.visitId }
        pairMap.set(key, { ...existing, [p.photoType]: p })
      }
      return Array.from(pairMap.values())
    },
    enabled: !!patientId && enabled,
  })
}

export function useUploadPhoto(patientId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post(`/patients/${patientId}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.photos(patientId) }),
  })
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export function usePatientCourses(patientId: string, enabled = true) {
  return useQuery({
    queryKey: keys.courses(patientId),
    queryFn: () =>
      api.get<PatientCourseEnriched[]>(`/patients/${patientId}/courses`)
        .then((r) => r.data),
    enabled: !!patientId && enabled,
  })
}

// ─── LAB results ──────────────────────────────────────────────────────────────

export function usePatientLabResults(patientId: string, enabled = true) {
  return useQuery({
    queryKey: keys.lab(patientId),
    queryFn: () =>
      api.get<LabResult[]>(`/patients/${patientId}/lab`, { params: { sortOrder: 'DESC' } })
        .then((r) => r.data),
    enabled: !!patientId && enabled,
  })
}

export interface CreateLabResultDto {
  testName: string
  result: string
  unit?: string
  refRange?: string
  testedAt: string
  visitId?: string
}

export function useCreateLabResult(patientId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateLabResultDto) =>
      api.post<LabResult>(`/patients/${patientId}/lab`, dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.lab(patientId) }),
  })
}

// ─── Receipts / Payments ──────────────────────────────────────────────────────

export function usePatientReceipts(patientId: string, enabled = true) {
  return useQuery({
    queryKey: keys.receipts(patientId),
    queryFn: () =>
      api.get<ReceiptSummary[]>('/finance/receipts', { params: { patientId, sortOrder: 'DESC' } })
        .then((r) => r.data),
    enabled: !!patientId && enabled,
  })
}

// ─── Diary ────────────────────────────────────────────────────────────────────

export function usePatientDiary(patientId: string, enabled = true) {
  return useQuery({
    queryKey: keys.diary(patientId),
    queryFn: () =>
      api.get<PatientDiary[]>(`/patients/${patientId}/diary`, { params: { sortOrder: 'DESC' } })
        .then((r) => r.data),
    enabled: !!patientId && enabled,
  })
}

export interface CreateDiaryDto {
  note: string
  recordedAt: string
}

export function useCreateDiaryEntry(patientId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateDiaryDto) =>
      api.post<PatientDiary>(`/patients/${patientId}/diary`, dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.diary(patientId) }),
  })
}

export function useUpdateDiaryEntry(patientId: string, entryId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: Partial<CreateDiaryDto>) =>
      api.patch<PatientDiary>(`/patients/${patientId}/diary/${entryId}`, dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.diary(patientId) }),
  })
}

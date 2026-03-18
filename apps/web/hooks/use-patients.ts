import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { usePatientStore } from '@/stores/patient.store'
import type { Patient, PaginatedResult } from '@quibes/shared'
import type { Gender } from '@quibes/shared'

const QUERY_KEY = 'patients'

// ─── Query params ────────────────────────────────────────────────────────────

export interface QueryPatientParams {
  page?: number
  limit?: number
  search?: string
  gender?: Gender | ''
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface CreatePatientDto {
  firstName: string
  lastName: string
  gender: string
  dob?: string
  phone?: string
  allergy?: string
  medicalHistory?: string
}

// ─── National ID (role-gated, fetched on demand) ──────────────────────────────

export interface NationalIdResult {
  nationalId: string
  masked:     boolean
  hasValue:   boolean
}

export function usePatientNationalId(patientId: string, enabled: boolean) {
  return useQuery({
    queryKey: [QUERY_KEY, patientId, 'national-id'],
    queryFn: () =>
      api
        .get<NationalIdResult>(`/patients/${patientId}/national-id`)
        .then((r) => r.data),
    enabled: enabled && !!patientId,
    staleTime: 0, // always refetch — sensitive data
    gcTime:    0, // don't keep in memory after unmount
  })
}

// ─── Autocomplete search (debounced query passed from component state) ────────
//
// Component keeps debounced `search` state, passes it here.
// TanStack Query handles caching + deduplication — no direct api call needed.

export interface PatientSearchResult {
  id: string
  code: string
  firstName: string
  lastName: string
  phone: string | null
}

export function usePatientSearch(search: string) {
  return useQuery({
    queryKey: [QUERY_KEY, 'search', search],
    queryFn: () =>
      api
        .get<PaginatedResult<Patient>>('/patients', {
          params: { search, limit: 8, page: 1 },
        })
        .then((r) => r.data.data as PatientSearchResult[]),
    enabled: search.trim().length > 0,
    staleTime: 30_000,
    placeholderData: (prev) => prev, // keep previous results while fetching new
  })
}

// ─── Pattern A: return query result directly (list uses data.data) ────────────

export function usePatients(query?: QueryPatientParams) {
  // Strip empty strings so they're not sent as query params
  const params = query
    ? Object.fromEntries(Object.entries(query).filter(([, v]) => v !== '' && v !== undefined))
    : undefined

  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () =>
      api.get<PaginatedResult<Patient>>('/patients', { params }).then((r) => r.data),
  })
}

// ─── Pattern B: fetch + sync to Zustand store ────────────────────────────────

export function usePatient(id: string) {
  const setCurrentPatient = usePatientStore.getState().setCurrentPatient

  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: async () => {
      const patient = await api.get<Patient>(`/patients/${id}`).then((r) => r.data)
      // Sync to store for cross-component access without prop drilling
      setCurrentPatient(patient)
      return patient
    },
    enabled: Boolean(id),
  })
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreatePatient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreatePatientDto) =>
      api.post<Patient>('/patients', dto).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useUpdatePatient(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: Partial<CreatePatientDto>) =>
      api.patch<Patient>(`/patients/${id}`, dto).then((r) => r.data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] })
      qc.invalidateQueries({ queryKey: [QUERY_KEY, id] })
      // Refresh store with updated data
      usePatientStore.getState().setCurrentPatient(updated)
    },
  })
}

export function useUploadPatientPhoto(patientId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post(`/patients/${patientId}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY, patientId] }),
  })
}

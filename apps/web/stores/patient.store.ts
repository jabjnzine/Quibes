import { create } from 'zustand'
import type { Patient } from '@quibes/shared'

interface PatientState {
  currentPatient: Patient | null
  setCurrentPatient: (patient: Patient) => void
  reset: () => void
}

export const usePatientStore = create<PatientState>((set) => ({
  currentPatient: null,
  setCurrentPatient: (patient) => set({ currentPatient: patient }),
  reset: () => set({ currentPatient: null }),
}))

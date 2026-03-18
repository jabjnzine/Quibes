import { Gender } from '../enums/gender.enum'

export interface Patient {
  id: string
  code: string
  firstName: string
  lastName: string
  gender: Gender
  dob?: string
  phone?: string
  allergy?: string
  medicalHistory?: string
  createdAt: string
  updatedAt: string
}

export interface PatientPhoto {
  id: string
  patientId: string
  visitId?: string
  photoType: 'before' | 'after'
  storagePath: string
  takenAt: string
}

export interface PatientDiary {
  id: string
  patientId: string
  note: string
  recordedAt: string
}

export interface LabResult {
  id: string
  patientId: string
  visitId?: string
  testName: string
  result: string
  unit?: string
  refRange?: string
  testedAt: string
}

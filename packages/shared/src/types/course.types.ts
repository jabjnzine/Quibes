import { CourseStatus } from '../enums/status.enum'

export interface Course {
  id: string
  name: string
  description?: string
  totalSessions: number
  price: number
  validityDays?: number
  isActive: boolean
  createdAt: string
}

export interface PatientCourse {
  id: string
  patientId: string
  courseId: string
  totalSessions: number
  usedSessions: number
  expiresAt?: string
  status: CourseStatus
  soldAt: string
  createdAt: string
  createdBy: string
}

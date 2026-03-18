import { AppointmentStatus } from '../enums/status.enum'

export interface Appointment {
  id: string
  patientId: string
  staffId?: string
  serviceId?: string
  scheduledAt: string
  status: AppointmentStatus
  note?: string
  createdAt: string
  updatedAt: string
}

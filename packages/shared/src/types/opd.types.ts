import { ItemType } from '../enums/payment.enum'
import { OpdVisitStatus } from '../enums/status.enum'

export interface OpdVisit {
  id: string
  patientId: string
  doctorId: string
  appointmentId?: string
  startedAt: string
  endedAt?: string
  diagnosis?: string
  note?: string
  status: OpdVisitStatus
  createdAt: string
  updatedAt: string
}

export interface OpdItem {
  id: string
  visitId: string
  itemType: ItemType
  referenceId: string
  quantity: number
  unitPrice: number
  discount: number
  total: number
}

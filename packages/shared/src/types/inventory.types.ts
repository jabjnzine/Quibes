import { StockMovementType, VialStatus } from '../enums/status.enum'

export interface Product {
  id: string
  code: string
  name: string
  category: string
  unit: string
  costPrice: number
  sellPrice: number
  canPartialUse: boolean
  defaultVialSizeMl?: number
  isActive: boolean
  createdAt: string
}

export interface InventoryStock {
  id: string
  productId: string
  quantityMl: number
  minQuantity: number
  updatedAt: string
}

export interface StockMovement {
  id: string
  productId: string
  type: StockMovementType
  quantityMl: number
  referenceId?: string
  note?: string
  createdAt: string
}

export interface PatientVial {
  id: string
  patientId: string
  productId: string
  opdItemId?: string
  totalMl: number
  usedMl: number
  remainingMl: number
  status: VialStatus
  openedAt: string
  expiresAt?: string
  disposedAt?: string
  disposeReason?: string
  note?: string
}

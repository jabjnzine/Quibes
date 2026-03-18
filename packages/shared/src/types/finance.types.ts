import { PaymentMethod, PaymentStatus, ItemType } from '../enums/payment.enum'

export interface Receipt {
  id: string
  visitId?: string
  patientId: string
  subtotal: number
  discount: number
  total: number
  paymentMethod: PaymentMethod
  status: PaymentStatus
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export interface ReceiptItem {
  id: string
  receiptId: string
  itemType: ItemType
  referenceId: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Expense {
  id: string
  category: string
  amount: number
  description?: string
  paidAt: string
  createdBy: string
  createdAt: string
}

export interface Deposit {
  id: string
  patientId: string
  amount: number
  remaining: number
  note?: string
  createdAt: string
}

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  TRANSFER = 'transfer',
  QR_CODE = 'qr_code',
  DEPOSIT = 'deposit',
  MIXED = 'mixed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIAL = 'partial',
  CANCELLED = 'cancelled',
}

export enum ItemType {
  SERVICE = 'service',
  PRODUCT = 'product',
  COURSE = 'course',
}

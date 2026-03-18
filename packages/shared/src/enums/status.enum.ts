export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export enum OpdVisitStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export enum CourseStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum VialStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  DISPOSED = 'disposed',
}

export enum StockMovementType {
  IN = 'in',
  OUT = 'out',
  ADJUST = 'adjust',
  OPEN_VIAL = 'open_vial',
  DISPOSE_VIAL = 'dispose_vial',
}

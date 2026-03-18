import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm'
import { PaymentMethod, PaymentStatus } from '@quibes/shared'
import { PatientEntity } from '../../patients/entities/patient.entity'
import { ReceiptItemEntity } from './receipt-item.entity'

@Entity('receipts')
export class ReceiptEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'visit_id', type: 'uuid', nullable: true })
  visitId: string

  @Index()
  @Column({ name: 'patient_id' })
  patientId: string

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  subtotal: number

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  discount: number

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total: number

  @Column({ name: 'payment_method', type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt: Date | null

  @ManyToOne(() => PatientEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity

  @OneToMany(() => ReceiptItemEntity, (item) => item.receipt)
  items: ReceiptItemEntity[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null
}

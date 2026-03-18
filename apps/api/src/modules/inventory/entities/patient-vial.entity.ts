import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { VialStatus } from '@quibes/shared'
import { PatientEntity } from '../../patients/entities/patient.entity'
import { ProductEntity } from './product.entity'

@Entity('patient_vials')
export class PatientVialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'patient_id' })
  patientId: string

  @Index()
  @Column({ name: 'product_id' })
  productId: string

  @Column({ name: 'opd_item_id', type: 'uuid', nullable: true })
  opdItemId: string

  @Column({ name: 'total_ml', type: 'numeric', precision: 8, scale: 2 })
  totalMl: number

  @Column({ name: 'used_ml', type: 'numeric', precision: 8, scale: 2, default: 0 })
  usedMl: number

  @Column({ name: 'remaining_ml', type: 'numeric', precision: 8, scale: 2 })
  remainingMl: number

  @Column({ type: 'enum', enum: VialStatus, default: VialStatus.ACTIVE })
  status: VialStatus

  @Column({ name: 'opened_at', type: 'timestamptz', default: () => 'NOW()' })
  openedAt: Date

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt: Date | null

  @Column({ name: 'disposed_at', type: 'timestamptz', nullable: true })
  disposedAt: Date | null

  @Column({ name: 'dispose_reason', type: 'varchar', nullable: true })
  disposeReason: string

  @Column({ nullable: true, type: 'text' })
  note: string

  @ManyToOne(() => PatientEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity

  @ManyToOne(() => ProductEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

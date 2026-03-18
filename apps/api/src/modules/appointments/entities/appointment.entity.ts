import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { AppointmentStatus } from '@quibes/shared'
import { PatientEntity } from '../../patients/entities/patient.entity'
import { StaffEntity } from '../../staff/entities/staff.entity'

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'patient_id' })
  patientId: string

  @Column({ name: 'staff_id', type: 'uuid', nullable: true })
  staffId: string

  @Column({ name: 'service_id', type: 'uuid', nullable: true })
  serviceId: string

  @Index()
  @Column({ name: 'scheduled_at', type: 'timestamptz' })
  scheduledAt: Date

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus

  /** Appointment duration in minutes — used for calendar end time */
  @Column({ name: 'duration_minutes', type: 'int', default: 30 })
  durationMinutes: number

  @Column({ nullable: true, type: 'text' })
  note: string

  /**
   * Backdate pattern: actual date the appointment was booked / sold.
   * Defaults to NOW() but user can back-date. Immutable after creation.
   */
  @Column({ name: 'sold_at', type: 'timestamptz', default: () => 'NOW()' })
  soldAt: Date

  /** Staff who created this appointment — from JWT, not user input */
  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null

  @ManyToOne(() => PatientEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity

  @ManyToOne(() => StaffEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'staff_id' })
  staff: StaffEntity | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null
}

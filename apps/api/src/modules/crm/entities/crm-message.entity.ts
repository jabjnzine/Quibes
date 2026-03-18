import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { PatientEntity } from '../../patients/entities/patient.entity'

export enum CrmChannel {
  LINE = 'line',
  SMS = 'sms',
}

export enum CrmMessageStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

@Entity('crm_messages')
export class CrmMessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'patient_id' })
  patientId: string

  @Column({ type: 'enum', enum: CrmChannel })
  channel: CrmChannel

  @Column({ type: 'text' })
  content: string

  @Column({ name: 'sent_at', type: 'timestamptz', nullable: true })
  sentAt: Date | null

  @Column({
    type: 'enum',
    enum: CrmMessageStatus,
    default: CrmMessageStatus.PENDING,
  })
  status: CrmMessageStatus

  @ManyToOne(() => PatientEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

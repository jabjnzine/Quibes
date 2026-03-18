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
import { OpdVisitEntity } from './opd-visit.entity'

@Entity('referrals')
export class ReferralEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'visit_id' })
  visitId: string

  @Index()
  @Column({ name: 'patient_id' })
  patientId: string

  @Column({ name: 'referred_to', type: 'text' })
  referredTo: string

  @Column({ type: 'text', nullable: true })
  reason: string

  @ManyToOne(() => OpdVisitEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'visit_id' })
  visit: OpdVisitEntity

  @ManyToOne(() => PatientEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

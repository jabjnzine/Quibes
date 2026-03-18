import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { PatientEntity } from './patient.entity'

@Entity('patient_diaries')
export class PatientDiaryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'patient_id' })
  patientId: string

  @Column({ type: 'text' })
  note: string

  @Column({ name: 'recorded_at', type: 'timestamptz', default: () => 'NOW()' })
  recordedAt: Date

  @ManyToOne(() => PatientEntity, (patient) => patient.diaries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

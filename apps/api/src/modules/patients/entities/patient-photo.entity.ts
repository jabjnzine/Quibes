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

@Entity('patient_photos')
export class PatientPhotoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'patient_id' })
  patientId: string

  @Column({ name: 'visit_id', type: 'uuid', nullable: true })
  visitId: string

  @Column({ name: 'photo_type', type: 'varchar', length: 10 })
  photoType: 'before' | 'after'

  @Column({ name: 'storage_path' })
  storagePath: string

  @Column({ name: 'taken_at', type: 'timestamptz', default: () => 'NOW()' })
  takenAt: Date

  @ManyToOne(() => PatientEntity, (patient) => patient.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

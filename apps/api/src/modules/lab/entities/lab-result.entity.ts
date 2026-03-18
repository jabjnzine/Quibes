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

@Entity('lab_results')
export class LabResultEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'patient_id' })
  patientId: string

  @Column({ name: 'visit_id', type: 'uuid', nullable: true })
  visitId: string

  @Column({ name: 'test_name' })
  testName: string

  @Column({ type: 'text' })
  result: string

  @Column({ nullable: true, type: 'varchar' })
  unit: string

  @Column({ name: 'ref_range', type: 'varchar', nullable: true })
  refRange: string

  @Column({ name: 'tested_at', type: 'timestamptz', default: () => 'NOW()' })
  testedAt: Date

  @ManyToOne(() => PatientEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'NOW()' })
  updatedAt: Date
}

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
import { StaffEntity } from '../../staff/entities/staff.entity'

@Entity('line_staff_assignments')
export class LineStaffAssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'patient_id' })
  patientId: string

  @Index()
  @Column({ name: 'staff_id' })
  staffId: string

  @Column({ name: 'assigned_at', type: 'timestamptz', default: () => 'NOW()' })
  assignedAt: Date

  @ManyToOne(() => PatientEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity

  @ManyToOne(() => StaffEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'staff_id' })
  staff: StaffEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

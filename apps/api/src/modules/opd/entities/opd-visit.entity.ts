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
import { OpdVisitStatus } from '@quibes/shared'
import { PatientEntity } from '../../patients/entities/patient.entity'
import { StaffEntity } from '../../staff/entities/staff.entity'
import { AppointmentEntity } from '../../appointments/entities/appointment.entity'
import { OpdItemEntity } from './opd-item.entity'

@Entity('opd_visits')
export class OpdVisitEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'patient_id' })
  patientId: string

  @Column({ name: 'doctor_id' })
  doctorId: string

  @Column({ name: 'appointment_id', type: 'uuid', nullable: true })
  appointmentId: string

  @Column({ name: 'started_at', type: 'timestamptz', default: () => 'NOW()' })
  startedAt: Date

  @Column({ name: 'ended_at', type: 'timestamptz', nullable: true })
  endedAt: Date | null

  @Column({ nullable: true, type: 'text' })
  diagnosis: string

  @Column({ nullable: true, type: 'text' })
  note: string

  @Column({
    type: 'enum',
    enum: OpdVisitStatus,
    default: OpdVisitStatus.WAITING,
  })
  status: OpdVisitStatus

  @ManyToOne(() => PatientEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity

  @ManyToOne(() => StaffEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'doctor_id' })
  doctor: StaffEntity

  @ManyToOne(() => AppointmentEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'appointment_id' })
  appointment: AppointmentEntity | null

  @OneToMany(() => OpdItemEntity, (item) => item.visit)
  items: OpdItemEntity[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null
}

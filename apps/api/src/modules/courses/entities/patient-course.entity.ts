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
import { CourseStatus } from '@quibes/shared'
import { PatientEntity } from '../../patients/entities/patient.entity'
import { CourseEntity } from './course.entity'
import { StaffEntity } from '../../staff/entities/staff.entity'

@Entity('patient_courses')
export class PatientCourseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'patient_id' })
  patientId: string

  @Index()
  @Column({ name: 'course_id' })
  courseId: string

  @Column({ name: 'total_sessions', type: 'int' })
  totalSessions: number

  @Column({ name: 'used_sessions', type: 'int', default: 0 })
  usedSessions: number

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt: Date | null

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.ACTIVE,
  })
  status: CourseStatus

  @Column({ name: 'sold_at', type: 'timestamptz', default: () => 'NOW()' })
  soldAt: Date

  @Column({ name: 'created_by' })
  createdBy: string

  @ManyToOne(() => PatientEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity

  @ManyToOne(() => CourseEntity, (course) => course.patientCourses, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'course_id' })
  course: CourseEntity

  @ManyToOne(() => StaffEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdByStaff: StaffEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

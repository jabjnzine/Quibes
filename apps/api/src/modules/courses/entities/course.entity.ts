import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm'
import { PatientCourseEntity } from './patient-course.entity'

@Entity('courses')
export class CourseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ nullable: true, type: 'text' })
  description: string

  @Column({ name: 'total_sessions', type: 'int' })
  totalSessions: number

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number

  @Column({ name: 'validity_days', type: 'int', nullable: true })
  validityDays: number | null

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @OneToMany(() => PatientCourseEntity, (pc) => pc.course)
  patientCourses: PatientCourseEntity[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null
}

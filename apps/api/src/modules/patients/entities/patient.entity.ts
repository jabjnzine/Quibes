import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToMany,
} from 'typeorm'
import { Gender } from '@quibes/shared'
import { PatientPhotoEntity } from './patient-photo.entity'
import { PatientDiaryEntity } from './patient-diary.entity'

@Entity('patients')
export class PatientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column({ unique: true })
  code: string

  @Column({ name: 'first_name' })
  firstName: string

  @Column({ name: 'last_name' })
  lastName: string

  @Column({ type: 'enum', enum: Gender })
  gender: Gender

  @Column({ type: 'date', nullable: true })
  dob: Date | null

  @Index()
  @Column({ nullable: true, type: 'varchar' })
  phone: string

  @Column({ nullable: true, type: 'text' })
  allergy: string

  @Column({ name: 'medical_history', nullable: true, type: 'text' })
  medicalHistory: string

  /**
   * AES-256-CBC encrypted national ID.
   * select:false — never returned in standard queries.
   * Always access via findOneWithNationalId() which respects role-based visibility.
   */
  @Column({ name: 'national_id', nullable: true, type: 'varchar', select: false })
  nationalId: string | null

  @OneToMany(() => PatientPhotoEntity, (photo) => photo.patient)
  photos: PatientPhotoEntity[]

  @OneToMany(() => PatientDiaryEntity, (diary) => diary.patient)
  diaries: PatientDiaryEntity[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null
}

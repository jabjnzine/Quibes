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
import { SurveyEntity } from './survey.entity'

@Entity('survey_responses')
export class SurveyResponseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'survey_id' })
  surveyId: string

  @Index()
  @Column({ name: 'patient_id' })
  patientId: string

  @Column({ type: 'jsonb', default: '{}' })
  answers: Record<string, unknown>

  @Column({ name: 'submitted_at', type: 'timestamptz', default: () => 'NOW()' })
  submittedAt: Date

  @ManyToOne(() => SurveyEntity, (survey) => survey.responses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'survey_id' })
  survey: SurveyEntity

  @ManyToOne(() => PatientEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

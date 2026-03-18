import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm'
import { SurveyResponseEntity } from './survey-response.entity'

@Entity('surveys')
export class SurveyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  title: string

  @Column({ type: 'jsonb', default: '[]' })
  questions: Record<string, unknown>[]

  @OneToMany(() => SurveyResponseEntity, (response) => response.survey)
  responses: SurveyResponseEntity[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null
}

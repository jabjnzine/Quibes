import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { StaffEntity } from '../../staff/entities/staff.entity'

@Entity('expenses')
export class ExpenseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column()
  category: string

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number

  @Column({ nullable: true, type: 'text' })
  description: string

  @Column({ name: 'paid_at', type: 'timestamptz' })
  paidAt: Date

  @Column({ name: 'created_by' })
  createdBy: string

  @ManyToOne(() => StaffEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdByStaff: StaffEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null
}

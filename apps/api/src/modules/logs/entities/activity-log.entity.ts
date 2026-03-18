import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { StaffEntity } from '../../staff/entities/staff.entity'

@Entity('activity_logs')
export class ActivityLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'user_id' })
  userId: string

  @Index()
  @Column()
  action: string

  @Index()
  @Column()
  entity: string

  @Column({ name: 'entity_id', type: 'varchar', nullable: true })
  entityId: string

  @Column({ name: 'old_value', type: 'jsonb', nullable: true })
  oldValue: Record<string, unknown> | null

  @Column({ name: 'new_value', type: 'jsonb', nullable: true })
  newValue: Record<string, unknown> | null

  @Column({ name: 'ip_address', type: 'varchar', nullable: true })
  ipAddress: string

  @ManyToOne(() => StaffEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: StaffEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

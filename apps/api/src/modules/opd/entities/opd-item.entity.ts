import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { ItemType } from '@quibes/shared'
import { OpdVisitEntity } from './opd-visit.entity'

@Entity('opd_items')
export class OpdItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'visit_id' })
  visitId: string

  @Column({ name: 'item_type', type: 'enum', enum: ItemType })
  itemType: ItemType

  @Column({ name: 'reference_id' })
  referenceId: string

  @Column({ type: 'int', default: 1 })
  quantity: number

  @Column({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2 })
  unitPrice: number

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  discount: number

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number

  @ManyToOne(() => OpdVisitEntity, (visit) => visit.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'visit_id' })
  visit: OpdVisitEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

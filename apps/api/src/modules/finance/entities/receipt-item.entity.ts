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
import { ReceiptEntity } from './receipt.entity'

@Entity('receipt_items')
export class ReceiptItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'receipt_id' })
  receiptId: string

  @Column({ name: 'item_type', type: 'enum', enum: ItemType })
  itemType: ItemType

  @Column({ name: 'reference_id' })
  referenceId: string

  @Column({ type: 'int', default: 1 })
  quantity: number

  @Column({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2 })
  unitPrice: number

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number

  @ManyToOne(() => ReceiptEntity, (receipt) => receipt.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receipt_id' })
  receipt: ReceiptEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

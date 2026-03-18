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
import { ProductEntity } from './product.entity'
import { PurchaseRequestEntity } from './purchase-request.entity'

export enum PurchaseOrderStatus {
  ORDERED = 'ordered',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
}

@Entity('purchase_orders')
export class PurchaseOrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'pr_id', type: 'uuid', nullable: true })
  prId: string

  @Index()
  @Column({ name: 'product_id' })
  productId: string

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  quantity: number

  @Column({ name: 'unit_cost', type: 'numeric', precision: 12, scale: 2 })
  unitCost: number

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total: number

  @Column({ name: 'ordered_at', type: 'timestamptz', default: () => 'NOW()' })
  orderedAt: Date

  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.ORDERED,
  })
  status: PurchaseOrderStatus

  @ManyToOne(() => ProductEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity

  @ManyToOne(() => PurchaseRequestEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'pr_id' })
  purchaseRequest: PurchaseRequestEntity | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

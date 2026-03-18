import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { StockMovementType } from '@quibes/shared'
import { ProductEntity } from './product.entity'

@Entity('stock_movements')
export class StockMovementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'product_id' })
  productId: string

  @Column({ type: 'enum', enum: StockMovementType })
  type: StockMovementType

  @Column({ name: 'quantity_ml', type: 'numeric', precision: 12, scale: 2 })
  quantityMl: number

  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId: string

  @Column({ nullable: true, type: 'text' })
  note: string

  @ManyToOne(() => ProductEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

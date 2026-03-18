import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { ProductEntity } from './product.entity'

@Entity('inventory_stock')
export class InventoryStockEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column({ name: 'product_id', unique: true })
  productId: string

  @Column({ name: 'quantity_ml', type: 'numeric', precision: 12, scale: 2, default: 0 })
  quantityMl: number

  @Column({ name: 'min_quantity', type: 'numeric', precision: 12, scale: 2, default: 0 })
  minQuantity: number

  @OneToOne(() => ProductEntity, (product) => product.stock, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToOne,
} from 'typeorm'
import { InventoryStockEntity } from './inventory-stock.entity'

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column({ unique: true })
  code: string

  @Column()
  name: string

  @Index()
  @Column()
  category: string

  @Column()
  unit: string

  @Column({ name: 'cost_price', type: 'numeric', precision: 12, scale: 2 })
  costPrice: number

  @Column({ name: 'sell_price', type: 'numeric', precision: 12, scale: 2 })
  sellPrice: number

  @Column({ name: 'can_partial_use', default: false })
  canPartialUse: boolean

  @Column({ name: 'default_vial_size_ml', type: 'numeric', precision: 8, scale: 2, nullable: true })
  defaultVialSizeMl: number | null

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @OneToOne(() => InventoryStockEntity, (stock) => stock.product)
  stock: InventoryStockEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null
}

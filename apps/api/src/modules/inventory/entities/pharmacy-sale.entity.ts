import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { ProductEntity } from './product.entity'
import { StaffEntity } from '../../staff/entities/staff.entity'

@Entity('pharmacy_sales')
export class PharmacySaleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column({ name: 'product_id' })
  productId: string

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  quantity: number

  @Column({ name: 'unit_price', type: 'numeric', precision: 12, scale: 2 })
  unitPrice: number

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total: number

  @Column({ name: 'sold_at', type: 'timestamptz', default: () => 'NOW()' })
  soldAt: Date

  @Column({ name: 'sold_by' })
  soldBy: string

  @ManyToOne(() => ProductEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity

  @ManyToOne(() => StaffEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'sold_by' })
  soldByStaff: StaffEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

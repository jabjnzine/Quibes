import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm'

export enum CashTransactionType {
  IN = 'in',
  OUT = 'out',
}

@Entity('cash_transactions')
export class CashTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: CashTransactionType })
  type: CashTransactionType

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number

  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId: string

  @Column({ nullable: true, type: 'text' })
  note: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

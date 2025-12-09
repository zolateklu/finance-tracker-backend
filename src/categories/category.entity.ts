import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { Budget } from '../budgets/budget.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 'tag' })
  icon: string;

  @Column({ default: '#6B7280' })
  color: string;

  @Column({ type: 'enum', enum: ['income', 'expense'] })
  type: 'income' | 'expense';

  @Column({ default: false })
  isDefault: boolean;

  @OneToMany(() => Transaction, (t) => t.category)
  transactions: Transaction[];

  @OneToMany(() => Budget, (b) => b.category)
  budgets: Budget[];
}

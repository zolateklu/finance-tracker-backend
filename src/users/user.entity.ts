import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { Budget } from '../budgets/budget.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: 'ETB' })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Transaction, (t) => t.user)
  transactions: Transaction[];

  @OneToMany(() => Budget, (b) => b.user)
  budgets: Budget[];
}

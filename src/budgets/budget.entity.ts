import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';

@Entity('budgets')
export class Budget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['weekly', 'monthly'], default: 'monthly' })
  period: 'weekly' | 'monthly';

  @Column({ type: 'date' })
  startDate: Date;

  @ManyToOne(() => User, (u) => u.budgets, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Category, (c) => c.budgets, { onDelete: 'CASCADE' })
  category: Category;

  @Column()
  categoryId: string;
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Budget } from './budget.entity';
import { Transaction } from '../transactions/transaction.entity';
import { CreateBudgetDto, UpdateBudgetDto } from './dto/budget.dto';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget) private repo: Repository<Budget>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
  ) {}

  create(userId: string, dto: CreateBudgetDto) {
    const budget = this.repo.create({ ...dto, userId });
    return this.repo.save(budget);
  }

  findAll(userId: string) {
    return this.repo.find({ where: { userId }, relations: ['category'], order: { startDate: 'DESC' } });
  }

  async findOne(userId: string, id: string) {
    const b = await this.repo.findOne({ where: { id, userId }, relations: ['category'] });
    if (!b) throw new NotFoundException();
    return b;
  }

  async update(userId: string, id: string, dto: UpdateBudgetDto) {
    await this.findOne(userId, id);
    await this.repo.update({ id, userId }, dto);
    return this.findOne(userId, id);
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.repo.delete({ id, userId });
    return { deleted: true };
  }

  async getProgress(userId: string) {
    const budgets = await this.findAll(userId);
    const now = new Date();

    return Promise.all(
      budgets.map(async (b) => {
        const start = new Date(b.startDate);
        const end = new Date(start);
        b.period === 'monthly' ? end.setMonth(end.getMonth() + 1) : end.setDate(end.getDate() + 7);

        const spent = await this.txRepo
          .createQueryBuilder('t')
          .select('SUM(t.amount)', 'total')
          .where('t.userId = :userId', { userId })
          .andWhere('t.categoryId = :catId', { catId: b.categoryId })
          .andWhere('t.type = :type', { type: 'expense' })
          .andWhere('t.date BETWEEN :start AND :end', { start, end })
          .getRawOne();

        return { ...b, spent: +spent?.total || 0, remaining: +b.amount - (+spent?.total || 0) };
      }),
    );
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto, UpdateTransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(@InjectRepository(Transaction) private repo: Repository<Transaction>) {}

  create(userId: string, dto: CreateTransactionDto) {
    const transaction = this.repo.create({ ...dto, userId });
    return this.repo.save(transaction);
  }

  findAll(userId: string, page = 1, limit = 20) {
    return this.repo.find({
      where: { userId },
      relations: ['category'],
      order: { date: 'DESC', createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(userId: string, id: string) {
    const t = await this.repo.findOne({ where: { id, userId }, relations: ['category'] });
    if (!t) throw new NotFoundException();
    return t;
  }

  async update(userId: string, id: string, dto: UpdateTransactionDto) {
    await this.findOne(userId, id);
    await this.repo.update({ id, userId }, dto);
    return this.findOne(userId, id);
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.repo.delete({ id, userId });
    return { deleted: true };
  }

  async getSummary(userId: string, startDate: string, endDate: string) {
    const transactions = await this.repo.find({
      where: { userId, date: Between(new Date(startDate), new Date(endDate)) },
    });

    const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + +t.amount, 0);
    const expense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + +t.amount, 0);

    return { income, expense, balance: income - expense, count: transactions.length };
  }
}

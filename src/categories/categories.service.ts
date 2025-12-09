import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  create(dto: CreateCategoryDto) {
    const category = this.repo.create(dto);
    return this.repo.save(category);
  }

  findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException();
    return c;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { deleted: true };
  }

  async seedDefaults() {
    const count = await this.repo.count();
    if (count > 0) return;
    const defaults = [
      { name: 'Salary', icon: 'briefcase', color: '#2ECC71', type: 'income' as const },
      { name: 'Food', icon: 'utensils', color: '#E74C3C', type: 'expense' as const },
      { name: 'Transport', icon: 'car', color: '#3498DB', type: 'expense' as const },
      { name: 'Shopping', icon: 'shopping-bag', color: '#9B59B6', type: 'expense' as const },
      { name: 'Bills', icon: 'file-text', color: '#F39C12', type: 'expense' as const },
      { name: 'Health', icon: 'medkit', color: '#1ABC9C', type: 'expense' as const },
      { name: 'Giving', icon: 'heart', color: '#E91E63', type: 'expense' as const },
      { name: 'Entertainment', icon: 'film', color: '#673AB7', type: 'expense' as const },
    ];
    const categories = defaults.map((d) => this.repo.create({ ...d, isDefault: true }));
    return this.repo.save(categories);
  }
}

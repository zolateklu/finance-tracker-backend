import { IsNumber, IsEnum, IsDateString, IsUUID, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBudgetDto {
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsEnum(['weekly', 'monthly'])
  period?: 'weekly' | 'monthly';

  @IsDateString()
  startDate: string;

  @IsUUID()
  categoryId: string;
}

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {}

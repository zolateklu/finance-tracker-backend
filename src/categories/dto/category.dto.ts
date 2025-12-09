import { IsString, IsEnum, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

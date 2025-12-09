import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { BudgetsModule } from './budgets/budgets.module';
import { User } from './users/user.entity';
import { Transaction } from './transactions/transaction.entity';
import { Category } from './categories/category.entity';
import { Budget } from './budgets/budget.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        entities: [User, Transaction, Category, Budget],
        synchronize: true, // disable in production
        ssl: { rejectUnauthorized: false },
      }),
    }),
    AuthModule,
    TransactionsModule,
    CategoriesModule,
    BudgetsModule,
  ],
})
export class AppModule {}

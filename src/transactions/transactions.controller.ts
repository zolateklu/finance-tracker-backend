import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionDto } from './dto/transaction.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private service: TransactionsService) {}

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateTransactionDto) {
    return this.service.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: { id: string }, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.service.findAll(user.id, page ? +page : 1, limit ? +limit : 20);
  }

  @Get('summary')
  getSummary(@CurrentUser() user: { id: string }, @Query('startDate') start: string, @Query('endDate') end: string) {
    return this.service.getSummary(user.id, start, end);
  }

  @Get(':id')
  findOne(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.service.findOne(user.id, id);
  }

  @Put(':id')
  update(@CurrentUser() user: { id: string }, @Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.service.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.service.remove(user.id, id);
  }
}

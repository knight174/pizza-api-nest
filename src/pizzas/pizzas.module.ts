import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PizzasController } from './pizzas.controller';
import { PizzasService } from './pizzas.service';

@Module({
  controllers: [PizzasController],
  providers: [PizzasService],
  imports: [PrismaModule],
})
export class PizzasModule {}

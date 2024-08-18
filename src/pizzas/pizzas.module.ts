import { Module } from '@nestjs/common';
import { PizzasService } from './pizzas.service';
import { PizzasController } from './pizzas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PizzasController],
  providers: [PizzasService],
  imports: [PrismaModule],
})
export class PizzasModule {}

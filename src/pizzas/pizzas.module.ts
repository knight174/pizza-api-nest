import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { PizzasController } from './pizzas.controller';
import { PizzasService } from './pizzas.service';

@Module({
  imports: [DrizzleModule],
  controllers: [PizzasController],
  providers: [PizzasService],
})
export class PizzasModule {}

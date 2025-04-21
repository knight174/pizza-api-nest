import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';

@Module({
  controllers: [CartsController],
  providers: [CartsService],
  imports: [PrismaModule],
})
export class CartsModule {}

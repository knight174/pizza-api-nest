import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';

@Module({
  imports: [DrizzleModule],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}

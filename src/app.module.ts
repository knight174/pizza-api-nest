import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PizzasModule } from './pizzas/pizzas.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [UsersModule, PizzasModule, CartsModule, OrdersModule],
})
export class AppModule {}

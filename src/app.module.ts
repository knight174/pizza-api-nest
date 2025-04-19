import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { PizzasModule } from './pizzas/pizzas.module';
import { UsersModule } from './users/users.module';

import { PrismaModule } from './prisma/prisma.module';

import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { JwtGuard } from './common/guards/jwt.guard';
import { JwtStrategy } from './auth/strategy/jwt.strategy';

const guard = {
  provide: APP_GUARD, // 全局守卫
  useClass: JwtGuard, // 使用 JwtGuard 类来拦截，如果路由未标记@Public() ，则每个传入请求都会经过 JWT 身份验证
};

@Module({
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    guard, // 设置全局守卫
    JwtStrategy, // 注册 JwtStrategy，来验证 JWT（与上面的 JwtGuard 相配合）
  ],
  imports: [
    // 引入配置模块
    ConfigModule.forRoot({
      cache: true, // 缓存配置文件
      isGlobal: true, // 将配置文件加载到全局
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'], // 配置环境变量文件路径
    }),
    AuthModule,
    UsersModule,
    PizzasModule,
    CartsModule,
    OrdersModule,
    PrismaModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { PizzasModule } from './pizzas/pizzas.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';

import { PrismaModule } from './prisma/prisma.module';

import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';

@Module({
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    // 设置全局守卫
    {
      provide: APP_GUARD, // 全局守卫
      useClass: JwtGuard, // 使用 JwtGuard 类来拦截，如果路由未标记@Public() ，则每个传入请求都会经过 JWT 身份验证
    },
    JwtStrategy, // 注册 JwtStrategy，来验证 JWT（与上面的 JwtGuard 相配合）
  ],
  imports: [
    ConfigModule.forRoot({
      cache: true, // 缓存配置文件
      isGlobal: true, // 将配置文件加载到全局
      envFilePath: '.env.development.local', // 配置环境变量文件路径
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

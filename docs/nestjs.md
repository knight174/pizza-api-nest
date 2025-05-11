# NestJS

## 常用指令

```bash
# 创建模块
nest g module <module-name>
# 创建控制器
nest g controller <controller-name>
# 创建服务
nest g service <service-name>
# 创建中间件
nest g middleware <middleware-name>
# 创建守卫
nest g guard <guard-name>
# 创建拦截器
nest g interceptor <interceptor-name>
# 创建管道
nest g pipe <pipe-name>
# 创建异常过滤器
nest g filter <filter-name>
# 创建网关
nest g gateway <gateway-name>
# 创建管道
nest g pipe <pipe-name>
# 创建实体
nest g entity <entity-name>
# 创建 DTO
nest g dto <dto-name>
# 创建仓库
nest g repository <repository-name>
# 创建应用
nest new <app-name>
```

## Module

`@Module` 是 NestJS 中的一个装饰器，用于定义模块。模块是 NestJS 应用程序的基本构建块，它们将相关的功能组织在一起。

```ts
import { Module } from '@nestjs/common';

@Module({
  imports: [], // 导入其他模块
  controllers: [], // 导入控制器，处理请求（处理路由逻辑，并与服务层交互）
  providers: [], // 导入服务，处理业务逻辑（处理数据相关，并与数据库、第三方 API 或其他外部资源交互，执行相关任务）
  exports: [], // 导出模块
})
export class AppModule {}
```

## Controller

`@Controller` 是 NestJS 中的一个装饰器，用于定义控制器。控制器是处理传入请求并返回响应的类。

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppEntity } from './app.entity';
import { AppDto } from './app.dto';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): AppDto {
    return this.appService.getHello();
  }
}
```

## Service

`@Injectable` 是 NestJS 中的一个装饰器，用于定义服务。服务是处理业务逻辑的类，通常用于与数据库、第三方 API 或其他外部资源交互。

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): AppDto {
    return {
      message: 'Hello World!',
    };
  }
}
```

## Entity(Model)

模型充当现实世界对象的表示，并指导特定数据实体的组织方式以及存储方式。

需要集成 ORM，并通过它映射到数据库表，ORM 有：

- TypeORM（官方文档中提到）
- Sequelize
- Prisma
- Drizzle（🌟 推荐）

以 TypeORM 为例：

- TypeORM 允许您使用面向对象的语法创建、检索、更新和删除数据库中的记录。
- 通过利用装饰器和元数据，实体可以定义具有关系、验证和其他与数据库相关的详细信息。
- TypeORM 抽象了底层的 SQL 查询，使您能够以更直观的、以 TypeScript 为中心与数据库进行交互。

```ts
// task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity()
export class Task {
  @PrimaryGeneratedColumn() // 主键自增
  id: number;
  @Column() // 列
  title: string;
  @Column()
  description: string;
  @Column({ default: 'OPEN' }) // 列，默认值为 OPEN
  status: string;
}
```

## DTO (Validation) 数据传输对象

DTO 作为验证器，仔细检查传入数据，以确保它在继续之前符合预定义的规则。

假设应用程序中有一个用户输入表单：

- DTO 类似于**验证**机制，检查每个字段以确保其符合特定标准。
- DTO 还可以将**数据转换**为所需的格式，例如将字符串转换为数字或日期对象。

集成 `class-validator` 和 `class-transformer` 可以进一步提高 DTO 的有效性：

- `class-validator` 用于验证数据，它提供了一套强大的装饰器，用于定义验证规则。例如，`@IsString()`、`@IsInt()`、`@IsEmail()` 等。通过使用这些装饰器，DTO 变成了复杂的验证工具，仔细检查传入数据是否符合预定义标准。
- `class-transformer` 用于转换数据，它允许将原始数据转换为特定类型的对象。例如，将字符串转换为日期对象或将嵌套对象转换为类实例。通过使用 `class-transformer`，DTO 不仅可以验证数据，还可以确保数据以正确的格式传递到应用程序的其他部分。

```ts
// create-task.dto.ts
import { IsString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional() // 可选（影响运行时的数据验证，如果该字段不存在，跳过后续验证）
  @Type(() => Date) // 将字符串转换为 Date 对象
  @IsDateString() // 验证是否为有效的日期字符串
  dueDate?: Date; // 使用可选操作符 ?（影响编译时的类型检查，和 TypeScript 的类型有关）
}
```

## Decorator 装饰器

创建自定义装饰器来访问 **请求对象** 中的任何信息。这些装饰器可以从传入的 HTTP 请求中提取与用户相关的数据，例如用户的 ID、角色或任何其他相关信息。

```ts
// get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity'; // 假设有一个 User 实体

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // 假设用户信息存储在请求对象中的 user 属性中
    return request.user; // 返回请求中的用户信息
  },
);
```

- `createParamDecorator` 是 NestJS 提供的一个函数，用于创建自定义参数装饰器。
- `ExecutionContext` 是 NestJS 提供的一个接口，表示当前执行上下文。它提供了对请求、响应和其他相关信息的访问。

## Guard 守卫

通过实现自定义逻辑来保护路由和端点。

守卫可用于根据各种条件（如身份验证、授权、基于角色的访问等）控制对应用程序某些部分的访问。

常用的守卫之一是 JWT（JSON Web Token）守卫，通常用于身份验证。

`@UseGuards()` 装饰器用于将守卫应用于特定的路由、方法。当你使用此装饰器应用守卫时，意味着守卫中定义的相关逻辑将在路由处理程序被调用之前执行。

```ts
// jwt.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // 从请求头中获取 JWT，通常在 Authorization 字段中，例如：Authorization Bearer <token>
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return false;
    }
    try {
      const payload = this.jwtService.verify(token);
      request.user = payload; // Attach the user data to the request object
      return true;
    } catch (error) {
      return false;
    }
  }
}
```

- `canActivate` 方法是守卫的核心逻辑，它决定是否允许请求继续处理。
- `ExecutionContext` 提供了对请求、响应和其他相关信息的访问。

### 应用于类

```ts
// profile.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';

@Controller('profile')
@UseGuards(JwtGuard) // Apply the JwtGuard to this controller
export class ProfileController {
  @Get()
  getProfile() {
    // This route is protected by the JwtGuard
    // Access to this route requires a valid JWT
  }
}
```

### 应用于方法

```ts
// profile.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(JwtGuard) // Apply the JwtGuard to this specific route
  getProfile() {
    // This route is protected by the JwtGuard
    // Access to this route requires a valid JWT
  }
}
```

## Routing 路由

路由是定义传入请求如何被处理并导向应用程序适当部分的一个关键概念。它允许你将特定的路由映射到处理相应业务逻辑的控制器方法上。

```ts
// app.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';

@Controller('items')
export class ItemsController {
  @Get()
  getItems(
    @Query('category') category: string,
    @Query('status') status: string,
  ) {
    return `Get items with category: ${category} and status: ${status}`;
  }

  @Get(':id')
  getItem(@Param('id') id: string) {
    return `Get item with ID: ${id}`;
  }

  @Post()
  createItem(@Body() newItem: any) {
    return `Item created: ${JSON.stringify(newItem)}`;
  }

  @Patch(':id')
  editItem(@Param('id') id: string, @Body() updatedItem: any) {
    return `Item with ID ${id} updated: ${JSON.stringify(updatedItem)}`;
  }

  @Delete(':id')
  deleteItem(@Param('id') id: string) {
    return `Item with ID ${id} deleted`;
  }
}
```

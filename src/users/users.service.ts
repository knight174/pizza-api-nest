import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DrizzleOrm, PG_CONNECTION } from '../drizzle/drizzle.provider';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// 从 schema.ts 导入表定义和推断的类型
import { eq } from 'drizzle-orm';
import {
  NewUser as DrizzleNewUser,
  User as DrizzleUser,
  users,
} from '../drizzle/db/schema';

// 导入 UserEntity 和映射函数
import {
  UserEntity,
  mapDrizzleUserArrayToUserEntityArray,
  mapDrizzleUserToUserEntity,
} from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@Inject(PG_CONNECTION) private readonly db: DrizzleOrm) {}

  // 注册新用户
  // 注意：返回类型可以是 DrizzleUser (数据库原始对象) 或 UserEntity (API展示对象)
  // 这里我们返回 UserEntity 以便控制器层可以直接使用并符合 Swagger 定义
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this._findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('该邮箱已被注册');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUserPayload: DrizzleNewUser = {
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name, // 假设 CreateUserDto 包含 name, address, phone
      address: createUserDto.address,
      phone: createUserDto.phone,
      // id, created_at, updated_at 会由数据库或 Drizzle 默认值处理
    };

    const [createdDrizzleUser] = await this.db
      .insert(users) // 直接使用导入的 users 表对象
      .values(newUserPayload)
      .returning();

    if (!createdDrizzleUser) {
      throw new Error('创建用户失败');
    }
    return mapDrizzleUserToUserEntity(createdDrizzleUser); // 映射到 UserEntity
  }

  // 获取个人信息 (返回 UserEntity)
  async me(email: string): Promise<UserEntity | undefined> {
    // 使用 db.query (如果 schema 传递正确且包含 users 表)
    const drizzleUser = await this.db.query.users.findFirst({
      where: eq(users.email, email),
      // columns: { password: false } // 可以在查询级别排除密码
    });

    // 或者传统方式:
    // const [drizzleUser] = await this.db.select().from(users).where(eq(users.email, email));

    if (!drizzleUser) return undefined;
    return mapDrizzleUserToUserEntity(drizzleUser);
  }

  // 内部方法，用于服务层逻辑，返回原始 DrizzleUser 类型 (包含密码)
  async _findOneByEmail(email: string): Promise<DrizzleUser | undefined> {
    // const [user] = await this.db.select().from(users).where(eq(users.email, email));
    // return user;
    return this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async findAll(): Promise<UserEntity[]> {
    // const drizzleUsers = await this.db.query.users.findMany({
    // columns: { password: false } // 排除密码
    // });
    const drizzleUsers = await this.db.select().from(users); // 传统方式
    return mapDrizzleUserArrayToUserEntityArray(drizzleUsers);
  }

  async findOneById(id: string): Promise<UserEntity | undefined> {
    // id 是 uuid (string)
    const drizzleUser = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (!drizzleUser) return undefined;
    return mapDrizzleUserToUserEntity(drizzleUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const userToUpdate = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (!userToUpdate) {
      throw new NotFoundException(`ID 为 ${id} 的用户未找到`);
    }

    const updatePayload: Partial<DrizzleNewUser> = { ...updateUserDto }; // DTO 应该只包含允许更新的字段
    if (updateUserDto.password) {
      updatePayload.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const [updatedDrizzleUser] = await this.db
      .update(users)
      .set(updatePayload)
      .where(eq(users.id, id))
      .returning();

    if (!updatedDrizzleUser) {
      throw new Error('更新用户失败');
    }
    return mapDrizzleUserToUserEntity(updatedDrizzleUser);
  }

  async remove(id: string): Promise<{ message: string; user?: UserEntity }> {
    const [deletedDrizzleUser] = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (!deletedDrizzleUser) {
      throw new NotFoundException(`ID 为 ${id} 的用户未找到`);
    }
    return {
      message: `ID 为 ${id} 的用户已成功删除`,
      user: mapDrizzleUserToUserEntity(deletedDrizzleUser),
    };
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AccessToken } from './types/AccessToken';

import { User as DrizzleUser } from '../drizzle/db/schema';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  // 用户验证：将用户名和密码作为输入并检查用户是否存在以及密码是否正确
  async validateUser(
    email: string,
    password: string,
  ): Promise<DrizzleUser | null> {
    const user = await this.usersService._findOneByEmail(email);

    if (user && user.password) {
      // 确保 user 和 user.password 存在
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      }
    }
    return null;
  }

  // 登录：将用户数据作为输入并生成 JWT 令牌
  async login(user: DrizzleUser): Promise<AccessToken> {
    const payload = { email: user.email, sub: user.id, name: user.name };
    return { token: this.jwtService.sign(payload) };
  }

  // 注册新用户
  // async register(user: RegisterRequestDto): Promise<AccessToken> {
  //   // 防御已存在用户
  //   const existingUser = await this.usersService.findOneByEmail(user.email);
  //   if (existingUser) {
  //     throw new BadRequestException('该邮箱已被注册');
  //   }
  //   // hash 加密
  //   const hashedPassword = await bcrypt.hash(user.password, 10);

  //   // 创建用户
  //   const newUser = new UserEntity();
  //   newUser.email = user.email;
  //   newUser.password = hashedPassword;
  //   // newUser.name = user.name || '即刻披萨Bot';
  //   // newUser.address = user.address || '东胜神洲/傲来国/花果山福地/水帘洞';
  //   // newUser.phone = user.phone || '7758258';

  //   const saved = await this.usersService.create(newUser);

  //   return this.login(saved);
  // }

  // 获取用户信息
  async getUserInfo(user: UserEntity) {
    const email = user.email;
    return this.usersService.me(email);
  }

  async getUserInfoFromJwtPayload(jwtPayload: {
    sub: string;
    email: string;
  }): Promise<UserEntity | undefined> {
    // usersService.me 设计为返回 UserEntity
    return this.usersService.me(jwtPayload.email);
    // 或者如果 me 返回 DrizzleUser:
    // const drizzleUser = await this.usersService.meInternal(jwtPayload.email);
    // if (drizzleUser) return mapDrizzleUserToUserEntity(drizzleUser);
    // return undefined;
  }
}

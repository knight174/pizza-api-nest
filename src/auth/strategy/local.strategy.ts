/**
 * 本地身份验证策略
 * @description 使用 Passport.js 的本地策略进行用户身份验证，负责处理用户名/密码（这里使用 email/密码）的验证逻辑
 * @see https://docs.nestjs.com/security/authentication#local-strategy
 * 验证流程：
 * 1. 接收用户凭证（email 和 password）
 * 2. 调用 authService.validateUser() 验证用户
 * 3. 验证成功返回用户实体
 * 4. 验证失败抛出 UnauthorizedException
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import {
  mapDrizzleUserToUserEntity,
  UserEntity,
} from '../../users/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      // 告诉 Passport 查找用户时使用的字段（默认为 username）
      usernameField: 'email',
    });
  }

  // validate 方法由 Passport 调用。它应该返回一个用户对象（如果验证成功）或 null/false/抛出异常（如果失败）
  // 返回的对象会被附加到 Express 的 req.user 上
  // 用户验证
  async validate(email: string, password: string): Promise<UserEntity> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return mapDrizzleUserToUserEntity(user);
  }
}

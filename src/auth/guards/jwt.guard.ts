import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // 在验证之前，先判断是否是公开接口
  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | boolean | Observable<boolean> {
    // reflector 获取元数据中的 isPublic
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(), // 当前请求的handler
      context.getClass(), // 当前请求的controller
    ]);
    if (isPublic) return true; // 如果是公开接口，直接返回 true，无需验证
    // 否则调用父类的 AuthGuard，执行实际的 JWT 验证和身份验证检查
    return super.canActivate(context);
  }
}

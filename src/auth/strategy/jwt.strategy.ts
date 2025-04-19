import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AccessTokenPayload } from '../types/AccessTokenPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求头中提取 JWT
      // 自定义提取 JWT 的方法
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.headers.authorization) {
          // 移除可能存在的 'Bearer ' 前缀
          token = req.headers.authorization.replace('Bearer ', '');
        }
        return token;
      },
      ignoreExpiration: false, // 不忽略过期时间
      secretOrKey: configService.get('JWT_SECRET'), // 从配置中获取 JWT 密钥
    });
  }

  // 验证 JWT 的有效性
  // 如果 JWT 有效，则将其解码并返回有效负载
  // 如果 JWT 无效，则抛出 UnauthorizedException
  async validate(payload: AccessTokenPayload) {
    return payload;
  }
}

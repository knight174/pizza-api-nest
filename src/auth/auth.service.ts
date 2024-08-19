import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { AccessToken } from './types/AccessToken';
import { RegisterRequestDto } from './dto/register-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  // 用户验证：将用户名和密码作为输入并检查用户是否存在以及密码是否正确
  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user: UserEntity = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }
  // 登录：将用户数据作为输入并生成 JWT 令牌
  async login(user: UserEntity): Promise<AccessToken> {
    const payload = { email: user.email, id: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
  // 注册
  async register(user: RegisterRequestDto): Promise<AccessToken> {
    // 防御已存在用户
    const existingUser = await this.usersService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }
    // hash 加密
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // 创建用户
    const newUser = new UserEntity();
    newUser.email = user.email;
    newUser.password = hashedPassword;
    // newUser.name = user.name || '即刻披萨Bot';
    // newUser.address = user.address || '东胜神洲/傲来国/花果山福地/水帘洞';
    // newUser.phone = user.phone || '7758258';

    await this.usersService.create(newUser);

    return this.login(newUser);
  }
  // 获取用户信息
  async getUserInfo(user: UserEntity) {
    const email = user.email;
    return this.usersService.me(email);
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDTO } from './dto/login-response.dto';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 登录
  @Public() // 公开路由，不需要身份验证
  @UseGuards(AuthGuard('local')) // 身份验证守卫
  @Post('login')
  async login(
    @Body() loginDto: LoginRequestDto,
    @Request() req,
  ): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(req.user);
  }

  // 注册（用 /users 兼容了，这个接口可以不用）
  // @Public()
  // @Post('register')
  // async register(
  //   @Body() registerBody: RegisterRequestDto,
  // ): Promise<RegisterResponseDTO | BadRequestException> {
  //   return await this.authService.register(registerBody);
  // }

  // 获取用户信息
  @Get('me')
  @UseGuards(AuthGuard('jwt')) // 身份验证守卫
  async getMe(@Request() req) {
    return await this.authService.getUserInfo(req.user);
  }
}

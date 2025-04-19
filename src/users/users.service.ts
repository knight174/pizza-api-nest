import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 注册新用户
  async create(createUserDto: CreateUserDto) {
    // 防御已存在用户
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('该邮箱已被注册');
    }

    // hash 加密
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 创建用户
    const newUser = new UserEntity();
    newUser.email = createUserDto.email;
    newUser.password = hashedPassword;

    return await this.prisma.user.create({
      data: newUser,
    });
  }

  // 获取个人信息
  me(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        phone: true,
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // 通过邮箱查找用户
  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}

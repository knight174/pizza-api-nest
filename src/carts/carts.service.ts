import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  // 创建购物车
  create(userId: string, createCartDto: CreateCartDto) {
    return this.prisma.cart.create({
      data: {
        userId,
        ...createCartDto,
      },
    });
  }

  // 获取用户购物车
  findAllByUserId(userId: string) {
    return this.prisma.cart.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        pizza: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  // 更新购物车
  async update(id: string, updateCartDto: UpdateCartDto) {
    const cart = await this.prisma.cart.findUnique({ where: { id } });
    if (!cart) throw new NotFoundException('Cart not found');

    return this.prisma.cart.update({
      where: { id },
      data: updateCartDto,
    });
  }

  // 删除购物车
  async remove(id: string) {
    const cart = await this.prisma.cart.findUnique({ where: { id } });
    if (!cart) throw new NotFoundException('Cart not found');

    return this.prisma.cart.delete({ where: { id } });
  }
}

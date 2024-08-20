import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  async addToCart(dto: CreateCartDto, userId: string) {
    // 业务逻辑代码，添加商品到购物车
  }

  async updateCart(cartId: string, updateDto: UpdateCartDto, userId: string) {
    // 业务逻辑代码，更新购物车商品
  }

  async deleteCart(cartId: string, userId: string) {
    // 业务逻辑代码，删除购物车商品
  }

  create(createCartDto: CreateCartDto) {
    return 'This action adds a new cart';
  }

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

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  // 创建/添加购物车
  async create(user_id: string, createCartDto: CreateCartDto) {
    const existingCart = await this.prisma.cart.findFirst({
      where: {
        user_id,
        pizza_id: createCartDto.pizza_id,
        deleted_at: null,
      },
    });

    if (existingCart) {
      // 更新数量
      return this.prisma.cart.update({
        where: { id: existingCart.id },
        data: { quantity: { increment: createCartDto.quantity } },
        include: {
          pizza: true, // 包含关联的 pizza 数据
        },
      });
    } else {
      // 创建新购物车项
      return this.prisma.cart.create({
        data: {
          pizza_id: createCartDto.pizza_id,
          quantity: createCartDto.quantity,
          selected: createCartDto.selected ?? true,
          user_id: user_id,
        },
        include: {
          pizza: true, // 包含关联的 pizza 数据
        },
      });
    }
  }

  // 获取用户购物车
  findAllByUserId(user_id: string) {
    return this.prisma.cart.findMany({
      where: {
        user_id,
        deleted_at: null,
      },
      include: {
        pizza: true, // 获取关联的pizza信息
      },
      orderBy: {
        created_at: 'asc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  // 更新购物车
  async update(id: string, updateCartDto: UpdateCartDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { id, deleted_at: null },
    });
    if (!cart) throw new NotFoundException('Cart not found');

    return this.prisma.cart.update({
      where: { id },
      data: updateCartDto,
    });
  }

  // 批量更新
  async updateMultiple(ids: string[], selected: boolean) {
    // 查找未删除的购物车项
    const carts = await this.prisma.cart.findMany({
      where: {
        id: {
          in: ids,
        },
        deleted_at: null,
      },
    });

    if (carts.length > 0) {
      // 批量更新
      const updatedRecords = await this.prisma.cart.updateMany({
        where: {
          id: {
            in: ids,
          },
          deleted_at: null, // 确保未删除的项
        },
        data: {
          selected: selected,
        },
      });

      return updatedRecords;
    } else {
      throw new NotFoundException('购物车不存在');
    }
  }

  // 删除购物车
  async remove(id: string) {
    const cart = await this.prisma.cart.findUnique({ where: { id } });
    if (!cart) throw new NotFoundException('Cart not found');

    return this.prisma.cart.delete({ where: { id } });
  }
}

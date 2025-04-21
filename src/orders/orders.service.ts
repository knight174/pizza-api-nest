import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // 生成订单号
  generateOrderNo() {
    const timestamp = new Date().getTime().toString().slice(-4);
    return `T${timestamp}-${uuidv4().replace(/-/g, '')}`;
  }

  async create(user_id: string, createOrderDto: CreateOrderDto) {
    const carts = await this.prisma.cart.findMany({
      where: { user_id, selected: true, deleted_at: null },
      include: {
        pizza: true,
      },
    });

    if (carts.length === 0) {
      throw new InternalServerErrorException('请勾选要购买的披萨');
    }

    // 计算总价
    const total_price = carts.reduce((sum, item) => {
      const pizzaPrice = (item.pizza.price as Decimal).toNumber(); // 转换为 number 类型
      const discount = (item.pizza.discount as Decimal).toNumber(); // 转换为 number 类型
      const itemTotalPrice = pizzaPrice * (1 - discount) * item.quantity;
      return sum + itemTotalPrice;
    }, 0);

    try {
      const orderData = {
        user_id,
        order_no: this.generateOrderNo(),
        name: createOrderDto.name,
        phone: createOrderDto.phone,
        address: createOrderDto.address,
      };
      // 创建订单
      const order = await this.prisma.order.create({
        data: {
          ...orderData,
          total_price: new Decimal(total_price),
          order_items: {
            create: carts.map((item) => ({
              pizza_id: item.pizza_id,
              pizza_name: item.pizza.name,
              unit_price:
                (item.pizza.price as Decimal).toNumber() *
                (1 - (item.pizza.discount as Decimal).toNumber()),
              quantity: item.quantity,
              total_price:
                (item.pizza.price as Decimal).toNumber() *
                (1 - (item.pizza.discount as Decimal).toNumber()) *
                item.quantity,
            })),
          },
        },
      });

      // 删除购物车条目
      await this.prisma.cart.deleteMany({
        where: { id: { in: carts.map((item) => item.id) } },
      });

      return order;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll(user_id: string) {
    return this.prisma.order.findMany({
      where: { user_id },
    });
  }

  async findOne(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { order_no: id },
        include: { order_items: true },
      });

      if (!order) {
        throw new NotFoundException('订单不存在');
      }
      return order;
    } catch (error) {
      if (error.code === 'P2023') {
        throw new NotFoundException('无效的订单ID格式');
      }
      throw error;
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderDto.status,
        payment_type: updateOrderDto.type,
        payment_time: new Date(),
      },
    });
    return order;
  }

  async remove(id: string) {
    const result = await this.prisma.order.delete({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException('订单不存在');
    }
    return result;
  }
}

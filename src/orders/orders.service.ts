import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // 生成订单号
  generateOrderNo() {
    const timestamp = new Date().getTime().toString().slice(-4);
    return `T${timestamp}-${uuidv4().replace(/-/g, '')}`;
  }

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const carts = await this.prisma.cart.findMany({
      where: { userId, selected: true, deletedAt: null },
      include: {
        pizza: true,
      },
    });

    if (carts.length === 0) {
      throw new InternalServerErrorException('请勾选要购买的披萨');
    }

    // 计算总价
    const totalPrice = carts.reduce((sum, item) => {
      const pizzaPrice = (item.pizza.price as Decimal).toNumber(); // 转换为 number 类型
      const discount = (item.pizza.discount as Decimal).toNumber(); // 转换为 number 类型
      const itemTotalPrice = pizzaPrice * (1 - discount) * item.quantity;
      return sum + itemTotalPrice;
    }, 0);

    try {
      const orderData = {
        userId,
        orderNo: this.generateOrderNo(),
        name: createOrderDto.name,
        phone: createOrderDto.phone,
        address: createOrderDto.address,
      };
      // 创建订单
      const order = await this.prisma.order.create({
        data: {
          ...orderData,
          totalPrice: new Decimal(totalPrice),
          orderItems: {
            create: carts.map((item) => ({
              pizzaId: item.pizzaId,
              pizzaName: item.pizza.name,
              unitPrice:
                (item.pizza.price as Decimal).toNumber() *
                (1 - (item.pizza.discount as Decimal).toNumber()),
              quantity: item.quantity,
              totalPrice:
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

  findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
    });
  }

  async findOne(id: string) {
    console.log('id', id);
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: updateOrderDto.status,
        paymentType: updateOrderDto.type,
        paymentTime: new Date(),
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

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import Decimal from 'decimal.js'; // 用于精确计算
import { DrizzleOrm, PG_CONNECTION } from '../drizzle/drizzle.provider';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

// 导入 Drizzle schema, types, and operators
import { and, desc, eq, inArray, isNull } from 'drizzle-orm';
import {
  carts,
  CartItem as DrizzleCartItem, // Drizzle 推断的 Order 类型
  NewOrder as DrizzleNewOrder,
  NewOrderItem as DrizzleNewOrderItem,
  Order as DrizzleOrder,
  OrderItem as DrizzleOrderItem,
  Pizza as DrizzlePizza,
  order_items,
  orders,
} from '../drizzle/db/schema';

// 定义一个临时的 OrderItem 类型，不包含 order_id
type TemporaryOrderItemPayload = Omit<
  DrizzleNewOrderItem,
  'order_id' | 'id' | 'created_at' | 'updated_at'
>;

// 定义包含 Pizza 信息的 CartItem 类型 (如果 CartsService 中没有全局定义)
type CartItemWithPizza = DrizzleCartItem & { pizza: DrizzlePizza | null };
// 定义 API 响应的 Order 类型，包含 OrderItems
export type OrderWithItems = DrizzleOrder & { orderItems: DrizzleOrderItem[] };

@Injectable()
export class OrdersService {
  constructor(@Inject(PG_CONNECTION) private readonly db: DrizzleOrm) {}

  // 生成订单号
  private generateOrderNo(): string {
    // T + 当天日期YYYYMMDD + 4位时间戳后4位 + 4位随机数
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const timestampSuffix = date.getTime().toString().slice(-4);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    return `T${year}${month}${day}${timestampSuffix}${randomSuffix}`;
  }

  async create(
    user_id: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderWithItems> {
    // 1. 在事务中执行所有数据库操作
    return this.db.transaction(async (tx) => {
      // 2. 查询用户勾选的购物车项目（包含披萨详情）
      const selectedCarts = await tx.query.carts.findMany({
        where: and(
          eq(carts.user_id, user_id),
          eq(carts.selected, true),
          isNull(carts.deleted_at),
        ),
        with: {
          pizza: true, // 确保 cartsRelations 中定义了 pizza 关系
        },
      });

      if (selectedCarts.length === 0) {
        throw new BadRequestException('请选择至少一件商品来创建订单。');
      }

      // 3. 计算订单总价和准备订单项
      let calculatedTotalPrice = new Decimal(0);
      // 使用临时类型
      const tempOrderItems: TemporaryOrderItemPayload[] = [];
      // const orderItemsToCreate: DrizzleNewOrderItem[] = [];

      for (const cartItem of selectedCarts as CartItemWithPizza[]) {
        if (!cartItem.pizza) {
          throw new InternalServerErrorException(
            `购物车项 ${cartItem.id} 关联的披萨信息丢失。`,
          );
        }
        // Drizzle schema 中 price 和 discount 是 decimal 类型，通常作为 string 处理
        const pizzaPrice = new Decimal(cartItem.pizza.price); // 从 string 创建 Decimal
        const pizzaDiscount = new Decimal(cartItem.pizza.discount); // 从 string 创建 Decimal

        const unitPriceAfterDiscount = pizzaPrice.mul(
          new Decimal(1).sub(pizzaDiscount),
        );
        const itemTotalPrice = unitPriceAfterDiscount.mul(cartItem.quantity);

        calculatedTotalPrice = calculatedTotalPrice.add(itemTotalPrice);

        tempOrderItems.push({
          // id 会自动生成
          // order_id 将在订单创建后设置 (或由数据库关系处理，但手动设置更明确)
          pizza_id: cartItem.pizza_id,
          pizza_name: cartItem.pizza.name, // 快照名称
          unit_price: unitPriceAfterDiscount.toFixed(2), // 转为字符串，保留2位小数
          quantity: cartItem.quantity,
          total_price: itemTotalPrice.toFixed(2), // 转为字符串，保留2位小数
          // created_at, updated_at 会有默认值
        });
      }

      // 4. 创建订单主记录
      const newOrderPayload: DrizzleNewOrder = {
        user_id,
        order_no: this.generateOrderNo(),
        name: createOrderDto.name,
        phone: createOrderDto.phone,
        address: createOrderDto.address,
        total_price: calculatedTotalPrice.toFixed(2), // 转为字符串，保留2位小数
        status: 'pending', // 默认状态
        // payment_time, delivery_time, end_time, payment_type 默认为 null 或后续更新
        // created_at, updated_at 会有默认值
      };

      const [createdOrder] = await tx
        .insert(orders)
        .values(newOrderPayload)
        .returning();

      if (!createdOrder) {
        throw new InternalServerErrorException('创建订单失败。');
      }

      // 5. 为订单项设置 order_id 并批量插入
      if (tempOrderItems.length > 0) {
        const finalOrderItemsToCreate: DrizzleNewOrderItem[] =
          tempOrderItems.map((item) => ({
            ...item,
            order_id: createdOrder.id, // 现在添加 order_id
          }));
        await tx.insert(order_items).values(finalOrderItemsToCreate);
      }

      // 6. (软)删除已下单的购物车项
      const cartIdsToDelete = selectedCarts.map((item) => item.id);
      if (cartIdsToDelete.length > 0) {
        // 示例：软删除
        // await tx.update(carts)
        //   .set({ deleted_at: new Date(), selected: false, updated_at: new Date() })
        //   .where(inArray(carts.id, cartIdsToDelete));
        // 示例：硬删除 (与 Prisma 行为一致)
        await tx.delete(carts).where(inArray(carts.id, cartIdsToDelete));
      }

      // 7. 返回创建的订单及其订单项
      // Drizzle 的 .returning() 只返回了插入的 orders 表数据，不包含 order_items
      // 需要重新查询以包含 order_items
      const completeOrder = await tx.query.orders.findFirst({
        where: eq(orders.id, createdOrder.id),
        with: {
          orderItems: true, // 确保 ordersRelations 定义了 orderItems
        },
      });

      if (!completeOrder) {
        throw new InternalServerErrorException('创建订单后无法获取订单详情。');
      }
      return completeOrder as OrderWithItems;
    }); // 事务结束
  }

  async findAll(user_id: string): Promise<OrderWithItems[]> {
    const userOrders = await this.db.query.orders.findMany({
      where: eq(orders.user_id, user_id),
      with: {
        orderItems: true, // 包含订单项
      },
      orderBy: [desc(orders.created_at)], // 按创建时间降序排序
    });
    return userOrders as OrderWithItems[];
  }

  async findOneByOrderNo(orderNo: string): Promise<OrderWithItems | undefined> {
    // Prisma 用的是 order_no 作为唯一标识符查找，我们保持一致
    const order = await this.db.query.orders.findFirst({
      where: eq(orders.order_no, orderNo),
      with: {
        orderItems: true,
      },
    });

    if (!order) {
      // throw new NotFoundException(`订单号为 ${orderNo} 的订单不存在。`);
      return undefined; // 与 Prisma findUnique 行为对齐，找不到返回 undefined (或 null)
    }
    return order as OrderWithItems;
  }

  // 注意：Prisma 的 update 和 remove 用的是数据库 id (通常是UUID)
  // 如果 API 暴露的是 order_no，你需要先通过 order_no 找到 order_id
  async findOneById(id: string): Promise<DrizzleOrder | undefined> {
    return this.db.query.orders.findFirst({
      where: eq(orders.id, id),
    });
  }

  async update(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<DrizzleOrder> {
    // 假设 orderId 是数据库中的 UUID
    const existingOrder = await this.findOneById(orderId);
    if (!existingOrder) {
      throw new NotFoundException(`ID 为 ${orderId} 的订单不存在。`);
    }

    const updatePayload: Partial<DrizzleOrder> = {
      status: updateOrderDto.status,
      payment_type: updateOrderDto.type,
      updated_at: new Date(),
    };
    // 只有当 type 和 status 有效时才设置 payment_time
    if (updateOrderDto.type && updateOrderDto.status === 'finished') {
      // 'finished' 可能代表已支付并完成
      updatePayload.payment_time = new Date();
    }

    const [updatedOrder] = await this.db
      .update(orders)
      .set(updatePayload)
      .where(eq(orders.id, orderId))
      .returning();

    if (!updatedOrder) {
      // 如果 findOneById 成功，这里不应失败
      throw new InternalServerErrorException('更新订单状态失败。');
    }
    return updatedOrder;
  }

  async remove(orderId: string): Promise<{ id: string; order_no: string }> {
    // 假设 orderId 是数据库中的 UUID
    const existingOrder = await this.findOneById(orderId);
    if (!existingOrder) {
      throw new NotFoundException(`ID 为 ${orderId} 的订单不存在。`);
    }

    const [deletedOrderInfo] = await this.db
      .delete(orders)
      .where(eq(orders.id, orderId))
      .returning({ id: orders.id, order_no: orders.order_no });

    if (!deletedOrderInfo) {
      // 如果 findOneById 成功，这里不应失败
      throw new InternalServerErrorException('删除订单失败。');
    }
    return deletedOrderInfo;
  }
}

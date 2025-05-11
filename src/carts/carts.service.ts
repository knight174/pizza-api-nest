import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

// Import Drizzle schema, types, and operators
import { and, asc, eq, inArray, isNull, sql } from 'drizzle-orm';
import { DrizzleOrm, PG_CONNECTION } from 'src/drizzle/drizzle.provider';
import { CartItem, carts, NewCartItem, Pizza } from '../drizzle/db/schema';

// Define a type for Cart item with its related Pizza (matching Prisma's include)
export type CartItemWithPizza = CartItem & { pizza: Pizza | null };

@Injectable()
export class CartsService {
  constructor(@Inject(PG_CONNECTION) private readonly db: DrizzleOrm) {}

  // 创建/添加购物车
  async create(
    user_id: string,
    createCartDto: CreateCartDto,
  ): Promise<CartItemWithPizza> {
    const existingCartItem = await this.db.query.carts.findFirst({
      where: and(
        eq(carts.user_id, user_id),
        eq(carts.pizza_id, createCartDto.pizza_id),
        isNull(carts.deleted_at),
      ),
      // No need for 'with' here as we only check existence
    });

    let resultCartItem: CartItem;

    if (existingCartItem) {
      // 更新数量
      const [updatedItem] = await this.db
        .update(carts)
        .set({
          quantity: sql`${carts.quantity} + ${createCartDto.quantity}`,
          updated_at: new Date(),
        })
        .where(eq(carts.id, existingCartItem.id))
        .returning();
      if (!updatedItem) {
        throw new Error('Failed to update cart item quantity.');
      }
      resultCartItem = updatedItem;
    } else {
      // 创建新购物车项
      const newCartPayload: NewCartItem = {
        user_id,
        pizza_id: createCartDto.pizza_id,
        quantity: createCartDto.quantity,
        selected: createCartDto.selected ?? true,
      };
      const [createdItem] = await this.db
        .insert(carts)
        .values(newCartPayload)
        .returning();
      if (!createdItem) {
        throw new Error('Failed to create cart item.');
      }
      resultCartItem = createdItem;
    }

    // Fetch the created/updated cart item along with its pizza
    const cartItemWithDetails = await this.db.query.carts.findFirst({
      where: eq(carts.id, resultCartItem.id),
      with: {
        pizza: true, // 包括关联的pizza信息
      },
    });

    if (!cartItemWithDetails) {
      throw new NotFoundException(
        'Cart item details could not be fetched after operation.',
      );
    }

    // Ensure the return type matches CartItemWithPizza, pizza can be null if not found
    return cartItemWithDetails as CartItemWithPizza;
  }

  // 获取用户购物车
  async findAllByUserId(user_id: string): Promise<CartItemWithPizza[]> {
    const userCarts = await this.db.query.carts.findMany({
      where: and(eq(carts.user_id, user_id), isNull(carts.deleted_at)),
      with: {
        pizza: true, // Include related pizza data
      },
      orderBy: [asc(carts.created_at)],
    });
    return userCarts as CartItemWithPizza[];
  }

  async findOne(id: string): Promise<CartItemWithPizza | undefined> {
    const cartItem = await this.db.query.carts.findFirst({
      where: and(eq(carts.id, id), isNull(carts.deleted_at)),
      with: {
        pizza: true,
      },
    });
    return cartItem as CartItemWithPizza | undefined;
  }

  // 更新购物车
  async update(id: string, updateCartDto: UpdateCartDto) {
    const existingCartItem = await this.db.query.carts.findFirst({
      where: and(eq(carts.id, id), isNull(carts.deleted_at)),
    });

    if (!existingCartItem) {
      throw new NotFoundException(
        `Cart item with ID ${id} not found or has been deleted.`,
      );
    }

    const updatePayload: Partial<
      Omit<CartItem, 'id' | 'created_at' | 'user_id' | 'pizza_id'>
    > = {
      ...updateCartDto,
      updated_at: new Date(),
    };

    const [updatedDbItem] = await this.db
      .update(carts)
      .set(updatePayload)
      .where(eq(carts.id, id)) // id is already a string (uuid)
      .returning();

    if (!updatedDbItem) {
      throw new Error('Failed to update cart item.'); // Should not happen if existence check passed
    }

    // Fetch and return with pizza details
    const cartItemWithDetails = await this.db.query.carts.findFirst({
      where: eq(carts.id, updatedDbItem.id),
      with: {
        pizza: true,
      },
    });
    if (!cartItemWithDetails) {
      throw new NotFoundException(
        'Cart item details could not be fetched after update.',
      );
    }
    return cartItemWithDetails as CartItemWithPizza;
  }

  // 批量更新 selected 状态
  async updateMultiple(
    ids: string[],
    selected: boolean,
  ): Promise<{ count: number }> {
    if (!ids || ids.length === 0) {
      return { count: 0 };
    }

    // 显式定义期望的命令结果类型
    type PostgresJsCommandResult = {
      command?: string;
      count: number /* 其他可能的属性 */;
    };

    const queryResults = await this.db
      .update(carts)
      .set({
        selected: selected,
        updated_at: new Date(),
      })
      .where(and(inArray(carts.id, ids), isNull(carts.deleted_at)));

    // 使用类型断言 (as unknown as ...) 来强制转换类型
    // 首先断言为 unknown，然后再断言为目标类型，这是一种更安全的显式断言方式
    const results = queryResults as unknown as PostgresJsCommandResult[];

    if (Array.isArray(results) && results.length > 0) {
      const firstResult = results[0]; // firstResult 现在应该是 PostgresJsCommandResult 类型
      if (firstResult && typeof firstResult.count === 'number') {
        return { count: firstResult.count };
      }
    }

    console.warn(
      'CartsService: Could not determine the count of updated records from Drizzle updateMultiple result. Actual result:',
      queryResults, // 打印原始的 queryResults
    );
    return { count: 0 };
  }

  // ... (rest of the service)

  // 删除购物车项 (硬删除)
  async remove(id: string): Promise<{ deletedId: string; message: string }> {
    // Optional: Check if item exists before deleting
    const existingItem = await this.db.query.carts.findFirst({
      where: eq(carts.id, id),
    });
    if (!existingItem) {
      throw new NotFoundException(`Cart item with ID ${id} not found.`);
    }

    const [deletedItem] = await this.db
      .delete(carts)
      .where(eq(carts.id, id))
      .returning({ deletedId: carts.id }); // Return the ID of the deleted item

    if (!deletedItem || !deletedItem.deletedId) {
      // This case should ideally not be reached if the item existed
      throw new Error(
        'Failed to delete cart item or retrieve its ID after deletion.',
      );
    }
    return {
      deletedId: deletedItem.deletedId,
      message: `Cart item ${deletedItem.deletedId} deleted successfully.`,
    };
  }

  // --- Alternative: Soft Delete 软删除 ---
  /*
  async softRemove(id: string): Promise<CartItemWithPizza> {
    const existingItem = await this.db.query.carts.findFirst({
        where: and(
            eq(carts.id, id),
            isNull(carts.deleted_at)
        )
    });
    if (!existingItem) {
      throw new NotFoundException(`Active cart item with ID ${id} not found.`);
    }

    const [softDeletedItem] = await this.db
      .update(carts)
      .set({ deleted_at: new Date(), updated_at: new Date() })
      .where(eq(carts.id, id))
      .returning();

    if (!softDeletedItem) {
      throw new Error('Failed to soft delete cart item.');
    }

    // Fetch with pizza details to return consistent type
    const cartItemWithDetails = await this.db.query.carts.findFirst({
        where: eq(carts.id, softDeletedItem.id), // We fetch it even if soft-deleted to show its final state
        with: {
            pizza: true,
        },
    });
    if (!cartItemWithDetails) {
        throw new NotFoundException('Cart item details could not be fetched after soft delete.');
    }
    return cartItemWithDetails as CartItemWithPizza;
  }
  */
}

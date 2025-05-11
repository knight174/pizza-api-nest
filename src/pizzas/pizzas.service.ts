import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleOrm, PG_CONNECTION } from '../drizzle/drizzle.provider'; // 你的 Drizzle 实例
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { UpdatePizzaDto } from './dto/update-pizza.dto';

// 导入 Drizzle schema, types, 和 operators
import { and, eq, isNull, SQL } from 'drizzle-orm';
import { NewPizza, Pizza, pizzas } from '../drizzle/db/schema';

@Injectable()
export class PizzasService {
  constructor(@Inject(PG_CONNECTION) private readonly db: DrizzleOrm) {}

  async create(createPizzaDto: CreatePizzaDto): Promise<Pizza> {
    // 确保 DTO 的字段与 NewPizza 类型兼容
    const newPizzaPayload: NewPizza = {
      ...createPizzaDto,
      // price 和 discount 可能需要从 string 转换为 Drizzle decimal 接受的类型 (通常是 string)
      // Drizzle 的 defaultNow() 会处理 created_at 和 updated_at
      // id 会由 defaultRandom() 处理
      // sales, src 如果 DTO 中没有，会使用 schema 中的默认值
    };

    const [createdPizza] = await this.db
      .insert(pizzas)
      .values(newPizzaPayload)
      .returning();

    if (!createdPizza) {
      throw new Error('创建披萨失败');
    }
    return createdPizza;
  }

  async findAll(kind?: string): Promise<Pizza[]> {
    const conditions: SQL[] = [isNull(pizzas.deleted_at)]; // 基础条件：未被软删除

    if (kind && kind.toLowerCase() !== 'all') {
      conditions.push(eq(pizzas.tag, kind));
    }

    // 使用 db.query API (如果 schema 在 provider 中正确传递)
    return this.db.query.pizzas.findMany({
      where: and(...conditions),
      // orderBy: [desc(pizzas.createdAt)], // 可选的排序
    });

    // 或者使用传统的 select API
    // return this.db.select().from(pizzas).where(and(...conditions));
  }

  async findOne(id: string): Promise<Pizza | undefined> {
    // 使用 db.query API
    const pizza = await this.db.query.pizzas.findFirst({
      where: and(
        eq(pizzas.id, id),
        isNull(pizzas.deleted_at), // 确保未被软删除
      ),
    });

    // 或者使用传统的 select API
    // const [pizza] = await this.db
    //   .select()
    //   .from(pizzas)
    //   .where(and(eq(pizzas.id, id), isNull(pizzas.deleted_at)))
    //   .limit(1);

    if (!pizza) {
      // Prisma 的 findUnique 在找不到时会返回 null，这里 findFirst 返回 undefined
      // 如果需要严格的 NotFoundException，可以取消下一行的注释
      // throw new NotFoundException(`ID 为 ${id} 的披萨未找到`);
      return undefined;
    }
    return pizza;
  }

  async update(id: string, updatePizzaDto: UpdatePizzaDto): Promise<Pizza> {
    // 首先检查披萨是否存在且未被软删除
    const existingPizza = await this.findOne(id);
    if (!existingPizza) {
      throw new NotFoundException(`ID 为 ${id} 的披萨未找到或已被删除`);
    }

    // UpdatePizzaDto 不应包含 id, created_at, sales 等通常不由用户直接修改的字段
    // 或者，在这里构造一个明确的更新对象
    const updatePayload: Partial<
      Omit<Pizza, 'id' | 'created_at' | 'deleted_at' | 'sales'>
    > = {
      ...updatePizzaDto,
      updated_at: new Date(), // 手动更新 updated_at 时间戳
    };

    const [updatedPizza] = await this.db
      .update(pizzas)
      .set(updatePayload)
      .where(eq(pizzas.id, id))
      .returning();

    if (!updatedPizza) {
      // 理论上，如果上面的 findOne 找到了，这里应该能更新成功
      throw new Error('更新披萨失败');
    }
    return updatedPizza;
  }

  async remove(id: string): Promise<Pizza> {
    // Soft delete
    // 首先检查披萨是否存在且未被软删除
    const existingPizza = await this.findOne(id);
    if (!existingPizza) {
      throw new NotFoundException(`ID 为 ${id} 的披萨未找到或已被删除`);
    }

    const [softDeletedPizza] = await this.db
      .update(pizzas)
      .set({
        deleted_at: new Date(),
        updated_at: new Date(), // 也更新 updated_at
      })
      .where(eq(pizzas.id, id))
      .returning();

    if (!softDeletedPizza) {
      throw new Error('软删除披萨失败');
    }
    return softDeletedPizza;
  }

  // 如果需要硬删除 (不推荐，因为你有 deleted_at 字段)
  /*
  async hardRemove(id: string): Promise<{ deletedId: string }> {
    const [deletedItem] = await this.db
      .delete(pizzas)
      .where(eq(pizzas.id, id))
      .returning({ deletedId: pizzas.id });

    if (!deletedItem || !deletedItem.deletedId) {
      throw new NotFoundException(`ID 为 ${id} 的披萨未找到，无法删除`);
    }
    return deletedItem;
  }
  */
}

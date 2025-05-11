import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// users 表
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull().default('即刻披萨Bot'),
  address: text('address')
    .notNull()
    .default('东胜神洲/傲来国/花果山福地/水帘洞'),
  phone: text('phone').notNull().default('7758258'),
  created_at: timestamp('created_at', { withTimezone: false })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: false })
    .notNull()
    .defaultNow(),
});

// pizzas 表
export const pizzas = pgTable('pizzas', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  discount: decimal('discount', { precision: 10, scale: 2 })
    .notNull()
    .default('0.00'),
  sales: integer('sales').notNull().default(0),
  size: integer('size').notNull(), // 您可能想用 text 和 enum (例如: 'small', 'medium', 'large') 或者一个单独的 sizes 表
  tag: text('tag').notNull(), // 在服务中对应 'kind' 参数
  deleted_at: timestamp('deleted_at', { withTimezone: false }),
  created_at: timestamp('created_at', { withTimezone: false })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: false })
    .notNull()
    .defaultNow(),
  src: text('src')
    .notNull()
    .default(
      'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=2976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ),
});

// carts 表
// 购物车表
export const carts = pgTable('carts', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  pizza_id: uuid('pizza_id')
    .notNull()
    .references(() => pizzas.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull(),
  selected: boolean('selected').notNull().default(false),
  deleted_at: timestamp('deleted_at', { withTimezone: false }),
  created_at: timestamp('created_at', { withTimezone: false })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: false })
    .notNull()
    .defaultNow(),
});

// orders 表
// 订单表
export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'set null' }), // 用户删除，订单可保留但user_id设为null
  order_no: text('order_no').notNull().unique(),
  status: text('status').notNull().default('pending'), // 建议用枚举类型: 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
  total_price: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  payment_time: timestamp('payment_time', { withTimezone: false }),
  delivery_time: timestamp('delivery_time', { withTimezone: false }),
  end_time: timestamp('end_time', { withTimezone: false }),
  name: text('name').notNull(), // 收货人姓名
  phone: text('phone').notNull(), // 收货人电话
  address: text('address').notNull(), // 收货人地址
  created_at: timestamp('created_at', { withTimezone: false })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: false })
    .notNull()
    .defaultNow(),
  payment_type: text('payment_type'), // e.g., 'wechat', 'alipay', 'card'
});

// order_items 表
// 订单项表，存储每个订单的具体商品信息
export const order_items = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  order_id: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  pizza_id: uuid('pizza_id')
    .notNull()
    .references(() => pizzas.id, { onDelete: 'set null' }), // 商品删除，订单项可保留但pizza_id设为null
  pizza_name: text('pizza_name').notNull(), // 商品名称快照
  unit_price: decimal('unit_price', { precision: 10, scale: 2 }).notNull(), // 单价快照
  quantity: integer('quantity').notNull(),
  total_price: decimal('total_price', { precision: 10, scale: 2 }).notNull(), // 此项总价快照
  created_at: timestamp('created_at', { withTimezone: false })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: false })
    .notNull()
    .defaultNow(),
});

// --- 推断类型导出 ---
export type User = typeof users.$inferSelect; // 用于查询
export type NewUser = typeof users.$inferInsert; // 用于插入

export type Pizza = typeof pizzas.$inferSelect;
export type NewPizza = typeof pizzas.$inferInsert;

export type CartItem = typeof carts.$inferSelect;
export type NewCartItem = typeof carts.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof order_items.$inferSelect;
export type NewOrderItem = typeof order_items.$inferInsert;

// --- 关系定义 (可选, 但推荐使用 db.query 时定义) ---
import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
  carts: many(carts),
  orders: many(orders),
}));

export const pizzasRelations = relations(pizzas, ({ many }) => ({
  orderItems: many(order_items),
  cartItems: many(carts),
}));

export const cartsRelations = relations(carts, ({ one }) => ({
  user: one(users, { fields: [carts.user_id], references: [users.id] }),
  pizza: one(pizzas, { fields: [carts.pizza_id], references: [pizzas.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.user_id], references: [users.id] }),
  items: many(order_items),
}));

export const orderItemsRelations = relations(order_items, ({ one }) => ({
  order: one(orders, {
    fields: [order_items.order_id],
    references: [orders.id],
  }),
  pizza: one(pizzas, {
    fields: [order_items.pizza_id],
    references: [pizzas.id],
  }),
}));

// 确保在 drizzleProvider 中传递 schema 时包含这些关系对象
// const schemaBundle = { users, pizzas, carts, orders, order_items, usersRelations, ... };
// return drizzle(connection, { schema: schemaBundle });

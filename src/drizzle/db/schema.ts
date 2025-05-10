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
  discount: decimal('discount', { precision: 10, scale: 2 }).notNull(),
  sales: integer('sales').notNull(),
  size: integer('size').notNull(),
  tag: text('tag').notNull(),
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
  user_id: uuid('user_id').notNull(),
  pizza_id: uuid('pizza_id').notNull(),
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
  user_id: uuid('user_id').notNull(),
  order_no: text('order_no').notNull().unique(),
  status: text('status').notNull().default('pending'),
  total_price: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  payment_time: timestamp('payment_time', { withTimezone: false }),
  delivery_time: timestamp('delivery_time', { withTimezone: false }),
  end_time: timestamp('end_time', { withTimezone: false }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  created_at: timestamp('created_at', { withTimezone: false })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: false })
    .notNull()
    .defaultNow(),
  payment_type: text('payment_type'),
});

// order_items 表
// 订单项表，存储每个订单的具体商品信息
export const order_items = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  order_id: uuid('order_id').notNull(),
  pizza_id: uuid('pizza_id').notNull(),
  pizza_name: text('pizza_name').notNull(),
  unit_price: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  total_price: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
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

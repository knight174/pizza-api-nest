import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({
  path: '.env',
});

export default defineConfig({
  out: './drizzle/migrations', // 迁移文件输出目录
  schema: './src/drizzle/db/schema.ts', // 数据库表结构文件
  dialect: 'postgresql', // 数据库类型
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true, // 显示详细的日志
  strict: true,
});

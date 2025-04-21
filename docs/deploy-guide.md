# 部署指南

## 1. 数据库环境准备

### .env.\*

```bash
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://[DB-USER].[PROJECT-REF]:[YOUR-PASSWORD]@[DB-REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://[DB-USER].[PROJECT-REF]:[YOUR-PASSWORD]@[DB-REGION].pooler.supabase.com:5432/postgres"
```

### prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## 2. 数据库初始化

```bash
# 1. 运行数据库迁移
# 测试环境
bunx cross-env NODE_ENV=test dotenv -e .env.test -- prisma db push
# 生产环境
bunx cross-env NODE_ENV=production dotenv -e .env.production -- prisma db push

# 2. 填充初始数据
# 测试环境
bunx cross-env NODE_ENV=test dotenv -e .env.test -- ts-node prisma/seed.ts
# 或
bunx cross-env NODE_ENV=test dotenv -e .env.test -- prisma db seed

# 生产环境
bunx cross-env NODE_ENV=production dotenv -e .env.production -- ts-node prisma/seed.ts
# 或
bunx cross-env NODE_ENV=production dotenv -e .env.production -- prisma db seed
```

- `bunx` 使用 bunx 执行命令（Bun 的包执行器）
- `cross-env` 跨平台设置环境变量
- `dotenv -e .env.production` 加载 `.env.production` 文件
- `ts-node prisma/seed.ts` 执行 TypeScript 文件，用于初始化数据库的脚本
- `prisma db push` 将 Prisma schema 的更改推送到数据库
- `prisma db seed` 是用于填充数据库的命令

## 3. 运行应用

```bash
# 测试环境
bun run start:test
# 生产环境
bun run start:prod
```

## 4. 部署到 vercel

参见 [vercel-deploy.md](./vercel-deploy.md)。

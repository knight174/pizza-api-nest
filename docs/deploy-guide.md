# 生产部署指南

## 1. 生产环境准备

### 环境变量设置

```bash
DATABASE_URL="postgresql://用户名:密码@your-prod-host:5432/数据库名?schema=public"
```

### 步骤

#### 构建项目

```bash
bun run build
```

#### 数据库迁移

```bash
bunx prisma migrate deploy
```

> ⚠️ 注意：使用 migrate deploy 而不是 migrate dev，因为：
> - 不会生成新的迁移文件
> - 不会重置数据库
> - 只会应用未执行的迁移
> - 适合 CI/CD 环境

#### 生成 Prisma 客户端

```bash
bunx prisma generate
```

## 2. 推荐的部署脚本

```bash
#!/bin/bash

# 1. 安装依赖
bun install

# 2. 应用数据库迁移
bunx prisma migrate deploy

# 3. 生成 Prisma Client
bunx prisma generate

# 4. 构建应用
bun run build

# 5. 启动应用
bun run start:prod
```

## 3. CI/CD 部署（Github Actions）

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install

      - name: Apply migrations
        run: bunx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Build
        run: bun run build
```

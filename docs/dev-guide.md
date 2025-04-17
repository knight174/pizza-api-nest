# 开发指南

## 启动 PostgreSQL 容器

```bash
docker run --name pizza-postgres -e POSTGRES_USER=johndoe -e POSTGRES_PASSWORD=randompassword -e POSTGRES_DB=mydb -p 5432:5432 -d postgres:15
```

- `POSTGRES_USER`: 数据库用户名
- `POSTGRES_PASSWORD`: 数据库密码
- `POSTGRES_DB`: 数据库名称
- `5432`: PostgreSQL 默认端口

## 修改 .env

```bash
DATABASE_URL="postgresql://用户名:密码@localhost:5432/数据库名?schema=public"
```

## 初始化数据库

```bash
pnpm prisma migrate deploy # 用于生产环境
# 或
pnpm prisma migrate dev # 用于开发环境
```

## 生成 Prisma 客户端

```bash
pnpm prisma generate
```

## 运行 Prisma Studio

```bash
pnpm prisma studio
```

## 启动 NestJS 服务

```bash
pnpm run start:dev
```

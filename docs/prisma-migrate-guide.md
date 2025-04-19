# Prisma Migrate 指南

![prisma-migrate-flow](prisma-migrate-flow.png)

## 修改 `schema.prisma`

在 `schema.prisma` 文件中添加或修改模型。

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
```

- `@id` 表示主键
- `@default(autoincrement())` 表示自增主键
- `@unique` 表示唯一索引
- `@default(now())` 表示默认值为当前时间

## 1. 创建迁移

```bash
bun prisma migrate dev --name add_user_table
```

- `--name` 迁移名称

注意：

- 执行后会在 `prisma/migrations` 目录下生成一个新的迁移文件夹，里面包含了迁移的 SQL 文件和其他相关文件；
- 如果是第一次执行 `migrate dev`，会在 `prisma/migrations` 目录下生成一个名为 `init` 的迁移文件夹，里面包含了初始的数据库结构；
- 自动执行 SQL 语句，创建数据库表和字段；
- 自动执行 `prisma generate`，生成 Prisma Client 客户端。

## 2. 查看迁移文件

```bash
ls prisma/migrations
```

- 每个迁移文件夹的名称是一个时间戳，表示迁移的时间；
- 每个迁移文件夹下有一个 `migration.sql` 文件（例如：`prisma/migrations/TIMESTAMP_add_user_table/migration.sql`），里面包含了迁移的 SQL 语句；
- migrations 文件夹下有一个 `migration_lock.toml` 文件，里面包含了迁移的锁定信息。

## 3. 验证数据库更新

```bash
bun prisma studio  # 可视化查看数据库
# 或
bun prisma db pull # 从数据库拉取最新架构
```

## 2. 查看迁移状态

```bash
bun prisma migrate status
```

## 3. 查看迁移历史

```bash
bun prisma migrate history
```

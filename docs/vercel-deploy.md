# Vercel 部署指南

## 1. 添加 Vercel 配置文件

在项目根目录下创建 `vercel.json` 文件，内容如下：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.ts"
    }
  ]
}
```

- `builds`：指定构建文件和使用的构建器。
- `routes`：指定路由规则，将所有请求转发到 `src/main.ts` 文件。
- `src/main.ts`：你的 Node.js 服务器文件，确保它可以处理传入的请求。

## 2. 步骤

修改 `package.json` 文件，添加 Vercel 部署脚本：

```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && nest build"
  }
}
```

注意：

- 如果是首次部署，需要保证 supabase 数据库已经创建，并且在 `prisma/schema.prisma` 中配置了数据库连接字符串。而且，数据库应该是空的，如果不是空的，请先重置数据库。
- 本地执行 seed 脚本，确保数据库中有数据。

  ```bash
  # 运行 seed 脚本
  bunx cross-env NODE_ENV=production dotenv -e .env.production -- prisma db seed
  ```

## 3. 在 Vercel 控制台设置

1. 环境变量
   - 在 Vercel 控制台中，找到你的项目，点击 "Settings" -> "Environment Variables"。
   - 添加 `DATABASE_URL` 环境变量，值为你的 PostgreSQL 数据库连接字符串。
   - 例如：`postgresql://用户名:密码@your-prod-host:5432/数据库名?schema=public`
   - 注意：确保在 Vercel 中设置的环境变量与本地开发环境中的一致。
2. 构建命令
   - 在 Vercel 控制台中，找到你的项目，点击 "Settings" -> "Build & Development Settings"。
   - 在 "Build Command" 中输入 `npm run vercel-build`。
   - 在 "Output Directory" 中输入 `dist`，这是 NestJS 构建后的输出目录。
   - Install Command: `bun install`
3. 部署
   - 点击 "Deploy" 按钮，Vercel 会自动构建并部署你的应用。
   - 部署完成后，你可以在 Vercel 控制台中查看部署状态和访问链接。

## 4. 数据库考虑

- Neon (推荐，有免费计划)
- Supabase
- Railway

## 5. 本地测试 Vercel 部署

```bash
# 安装 Vercel CLI
bun add -g vercel

# 登录
vercel login

# 本地测试部署
vercel dev

# 部署到生产
vercel --prod
```

## 注意事项

1. 不要在 Vercel 上执行 `prisma migrate dev`

   - 只在本地开发环境中执行 `prisma migrate dev`
   - Vercel 上执行 `prisma migrate deploy`
   - 生产环境迁移在 CI/CD 中执行

2. Serverless 限制

   - 冷启动时间
   - 连接池限制
   - 函数执行时间限制

3. 数据库连接
   - 使用连接池管理
   - 考虑使用 Prisma Connection Manager
   - 注意 Serverless 环境的连接数限制
4. 监控
   - 使用 Vercel Analytics
   - 设置数据库监控
   - 配置错误告警

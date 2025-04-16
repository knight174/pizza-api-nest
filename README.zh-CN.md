# Pizza API (NestJS)

一个基于 [NestJS](https://nestjs.com/) 构建的披萨点餐与管理 RESTful API。

## 功能特性

- 用户认证（JWT）
- 披萨菜单管理
- 订单创建与管理
- 基于环境的配置
- E2E 与单元测试
- 代码风格与格式化（ESLint & Prettier）

## 技术栈

- [NestJS](https://nestjs.com/) (v10)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)（见依赖）
- [JWT](https://jwt.io/) 认证
- [pnpm](https://pnpm.io/) 包管理

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 环境变量

复制 `.env.example` 为 `.env`，并根据需要修改配置。

### 启动项目

```bash
# 开发环境
pnpm run start

# 监听模式
pnpm run start:dev

# 生产环境
pnpm run start:prod
```

### 测试

```bash
# 单元测试
pnpm run test

# 端到端测试
pnpm run test:e2e

# 测试覆盖率
pnpm run test:cov
```

### 代码检查与格式化

```bash
pnpm run lint
pnpm run format
```

## 项目结构

- `src/` - 主源码目录（模块、控制器、服务、装饰器等）
- `test/` - 测试文件
- `.eslintrc.js` - ESLint 配置
- `commitlint.config.js` - 提交信息规范配置

## 脚本

所有可用脚本请参见 `package.json`。

## 许可证

本项目采用 [MIT 许可证](LICENSE)。

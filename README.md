# Pizza API (NestJS)

[中文文档](./README.zh-CN.md)

A RESTful API for pizza ordering and management, built with [NestJS](https://nestjs.com/).

## Features

- User authentication (JWT)
- Pizza menu management
- Order creation and management
- Environment-based configuration
- E2E and unit testing
- Code style and linting with ESLint & Prettier

## Tech Stack

- [NestJS](https://nestjs.com/) (v10)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/) (see dependencies)
- [JWT](https://jwt.io/) for authentication
- [pnpm](https://pnpm.io/) for package management

## Getting Started

### Installation

```bash
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and update values as needed.

### Running the App

```bash
# development
pnpm run start

# watch mode
dpnm run start:dev

# production mode
pnpm run start:prod
```

### Testing

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov
```

### Linting & Formatting

```bash
pnpm run lint
pnpm run format
```

## Project Structure

- `src/` - Main source code (modules, controllers, services, decorators, etc.)
- `test/` - Test files
- `.eslintrc.js` - ESLint configuration
- `commitlint.config.js` - Commit message linting

## Scripts

See `package.json` for all available scripts.

## License

This project is [MIT licensed](LICENSE).

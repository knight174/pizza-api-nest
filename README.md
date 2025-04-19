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
- [bun](https://bun.sh/) for package management

## Getting Started

### Installation

```bash
bun install
```

### Environment Variables

Copy `.env.example` to `.env` and update values as needed.

### Running the App

```bash
# development
bun run start

# watch mode
bun run start:dev

# production mode
bun run start:prod
```

### Testing

```bash
# unit tests
bun run test

# e2e tests
bun run test:e2e

# test coverage
bun run test:cov
```

### Linting & Formatting

```bash
bun run lint
bun run format
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

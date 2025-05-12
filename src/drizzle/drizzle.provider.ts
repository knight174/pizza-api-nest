import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from './db/schema';

export const PG_CONNECTION = Symbol('PG_CONNECTION');

export type DrizzleOrm = PostgresJsDatabase<typeof schema>;

export const drizzleProvider: FactoryProvider<DrizzleOrm> = {
  provide: PG_CONNECTION,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const connectionString = configService.get<string>('DATABASE_URL');

    if (!connectionString) {
      throw new Error('DATABASE_URL is not set in environment variables');
    }

    const client = postgres(connectionString, {
      max: 10, // set maximum pool size
    });
    return drizzle(client, { schema, logger: true });
  },
};

import * as dotenv from 'dotenv';
import { type PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'; // Changed
import { migrate } from 'drizzle-orm/postgres-js/migrator'; // Changed
import path from 'path';
import postgres from 'postgres'; // Changed
import { exit } from 'process';
import * as allSchema from './schema';

dotenv.config();

(async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in .env file');
  }

  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 }); // Use postgres-js client for migrations
  const db: PostgresJsDatabase<typeof allSchema> = drizzle(migrationClient, {
    schema: allSchema,
  });

  console.log('⏳ Running migrations (using postgres-js)...');
  const start = Date.now();
  const migrationPath = path.join(process.cwd(), 'drizzle'); // 通常指向 drizzle.config.ts 的 out 目录

  await migrate(db, { migrationsFolder: migrationPath }); // migrationsFolder is relative to CWD or an absolute path
  // Check your drizzle.config.ts 'out' option

  const end = Date.now();
  console.log('✅ Migrations completed in', end - start, 'ms');
  await migrationClient.end(); // Important to close the connection for postgres-js if script exits
  exit(0);
})();

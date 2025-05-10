import * as dotenv from 'dotenv';
import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';
import pg from 'pg';
import { exit } from 'process';

import * as allSchema from './schema';

dotenv.config();

(async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in .env file');
  }

  // Create a new pool instance
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  let db: NodePgDatabase<typeof allSchema> | null = null;
  db = drizzle(pool, {
    schema: {
      ...allSchema,
    },
  });

  console.log('⏳ Running migrations...');

  const start = Date.now();

  // Look for migrations in the src/drizzle/migrations folder
  const migrationPath = path.join(process.cwd(), 'drizzle/migrations');

  // Run the migrations
  // 指向 drizzle.config.ts 中 out 目录
  await migrate(db, { migrationsFolder: migrationPath });

  const end = Date.now();

  // Insert default roles
  // for (const role of ['Super Admin', 'Admin', 'User', 'Guest']) {
  //   const existingUserRole = await db
  //     ?.select({
  //       name: allSchema.user_role.name,
  //     })
  //     .from(allSchema.user_role)
  //     .where(eq(allSchema.user_role.name, role));
  //   if (!existingUserRole[0]) {
  //     await db?.insert(allSchema.user_role).values({ name: role });
  //   }
  // }

  console.log('✅ Migrations completed in', end - start, 'ms');
  exit(0);
})();

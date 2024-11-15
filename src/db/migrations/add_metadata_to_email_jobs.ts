import { SQL, sql } from 'drizzle-orm';
import { pgTable, serial, varchar, timestamp, text, jsonb } from 'drizzle-orm/pg-core';

export async function up(db: { execute: (arg0: SQL<unknown>) => any; }) {
  await db.execute(
    sql`ALTER TABLE email_jobs ADD COLUMN IF NOT EXISTS metadata JSONB`
  );
}

export async function down(db: { execute: (arg0: SQL<unknown>) => any; }) {
  await db.execute(
    sql`ALTER TABLE email_jobs DROP COLUMN IF EXISTS metadata`
  );
} 
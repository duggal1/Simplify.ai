import { sql } from 'drizzle-orm';

export async function up(db: any) {
  // Drop the existing email_jobs table
  await sql`DROP TABLE IF EXISTS email_jobs CASCADE`;

  // Create new email_jobs table with proper constraints
  await sql`
    CREATE TABLE email_jobs (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL DEFAULT '',
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      error TEXT DEFAULT '',
      ip VARCHAR(45) DEFAULT '',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      recipient_count INTEGER NOT NULL DEFAULT 0
    )
  `;
}

export async function down(db: any) {
  await sql`DROP TABLE IF EXISTS email_jobs`;
} 
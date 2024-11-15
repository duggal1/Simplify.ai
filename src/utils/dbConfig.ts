import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Add error handling and fallback
if (!process.env.NEXT_PUBLIC_DATABASE_URL && !process.env.DATABASE_URL) {
  throw new Error('Database URL not found in environment variables');
}

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL ?? process.env.DATABASE_URL as string);

// Add connection validation
if (!sql) {
  throw new Error('Failed to create database connection');
}

export const db = drizzle(sql, {
  logger: process.env.NODE_ENV === 'development',
});

// Add connection test function
export async function testConnection() {
  try {
    await sql`SELECT 1`;
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
} 
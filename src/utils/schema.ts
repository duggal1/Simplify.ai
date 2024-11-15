import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  serial,
  primaryKey,
  PgColumn,
  PgTableWithColumns,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { relations, InferModel } from 'drizzle-orm';

// Base Users table
export const users = pgTable('users', {
  id: text('id').primaryKey().notNull(),  // This stores the Clerk ID
  name: text('name').notNull(),
  profileImage: text('profile_image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  email: text("email").notNull().unique(),
  username: text("username").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  points: integer("points").notNull().default(50),
  credits: integer("credits").default(30),
  subscription: boolean("subscription").default(false),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id")  // Changed to text to match users.id
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).notNull(),
  plan: varchar("plan", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Generated Content table
export const generatedContent = pgTable("generated_content", {
  id: serial("id").primaryKey(),
  userId: text("user_id")  // Changed to text to match users.id
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  content: text("content").notNull(),
  prompt: text("prompt").notNull(),
  contentType: varchar("content_type", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Email jobs table
export const emailJobs = pgTable('email_jobs', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  ip: varchar('ip', { length: 45 }).notNull(),
  recipientCount: serial('recipient_count').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  sentAt: timestamp('sent_at'),
  error: text('error'),
});

// Sessions table
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").unique().notNull(),
  userId: text("user_id")  // Changed to text to match users.id
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Verification Tokens table
export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => ({
  compositePk: primaryKey({ columns: [vt.identifier, vt.token] }),
}));



export type Session = typeof sessions.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type EmailJob = typeof emailJobs.$inferSelect;
export type NewEmailJob = typeof emailJobs.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type GeneratedContent = typeof generatedContent.$inferSelect;
export type NewGeneratedContent = typeof generatedContent.$inferInsert;

// Add type definitions
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

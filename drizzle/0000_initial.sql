CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "profile_image" text,
  "created_at" timestamp NOT NULL DEFAULT NOW(),
  "updated_at" timestamp NOT NULL DEFAULT NOW(),
  "clerk_id" text NOT NULL UNIQUE,
  "stripe_customer_id" text UNIQUE,
  "email" text NOT NULL UNIQUE,
  "username" text UNIQUE,
  "email_verified" timestamp,
  "points" integer NOT NULL DEFAULT 50,
  "credits" integer DEFAULT 30,
  "subscription" boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS "comments" (
  "id" serial PRIMARY KEY,
  "content" text NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "blog_slug" text NOT NULL,
  "parent_id" integer REFERENCES "comments"("id") ON DELETE CASCADE,
  "likes" integer NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT NOW(),
  "updated_at" timestamp NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "comments_blog_slug_idx" ON "comments"("blog_slug");
CREATE INDEX IF NOT EXISTS "comments_user_id_idx" ON "comments"("user_id");
CREATE INDEX IF NOT EXISTS "comments_parent_id_idx" ON "comments"("parent_id"); 
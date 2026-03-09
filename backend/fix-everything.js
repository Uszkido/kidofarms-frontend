const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function fixEverything() {
    console.log("🚀 Starting database schema sync...");

    try {
        // Fix Products Table
        console.log("Step 1: Fixing 'products' table...");
        await sql`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "owner_id" uuid;`;
        await sql`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "tracking_id" text;`;
        await sql`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "unit" text DEFAULT 'piece';`;
        await sql`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "is_featured" boolean DEFAULT false;`;
        console.log("✅ Products table updated.");

        // Fix Blog Posts
        console.log("Step 2: Fixing 'blog_posts' table...");
        await sql`ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'published';`;
        console.log("✅ Blog Posts table updated.");

        // Fix User Cards
        console.log("Step 3: Ensuring 'user_cards' table exists and matches schema...");
        // Drop if exists to ensure alignment with the new text-based expiry schema
        await sql`DROP TABLE IF EXISTS "user_cards";`;
        await sql`
            CREATE TABLE "user_cards" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "user_id" uuid NOT NULL REFERENCES "users"("id"),
                "card_brand" text NOT NULL,
                "last4" text NOT NULL,
                "expiry" text NOT NULL,
                "is_default" boolean DEFAULT false
            );
        `;
        console.log("✅ User Cards table recreated.");

        // Fix Harvests
        console.log("Step 4: Ensuring 'harvests' table exists...");
        await sql`
            CREATE TABLE IF NOT EXISTS "harvests" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "crop_name" text NOT NULL,
                "farm_name" text NOT NULL,
                "region" text NOT NULL,
                "status" text NOT NULL,
                "progress" integer NOT NULL DEFAULT 0,
                "estimated_ready_date" timestamp,
                "updated_at" timestamp DEFAULT now()
            );
        `;
        console.log("✅ Harvests table checked.");

        // Fix Categories
        console.log("Step 5: Ensuring 'categories' table exists...");
        await sql`
            CREATE TABLE IF NOT EXISTS "categories" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "name" text NOT NULL UNIQUE,
                "description" text,
                "image" text
            );
        `;
        console.log("✅ Categories table checked.");

        // Fix Orders (Escrow Shield)
        console.log("Step 6: Fixing 'orders' table for Escrow Shield...");
        await sql`ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "escrow_status" text DEFAULT 'held';`;
        console.log("✅ Orders table updated.");

        console.log("\n✨ Database schema is now synchronized with src/db/schema.js");
    } catch (err) {
        console.error("❌ Failed to synchronize schema:", err);
    }
    process.exit(0);
}

fixEverything();

require('dotenv').config();
const { db } = require('./src/db');
const { sql } = require('drizzle-orm');

async function run() {
    try {
        console.log('--- Updating Role Enum ---');
        const roles = ['wholesale_buyer', 'retailer', 'distributor'];
        for (const role of roles) {
            await db.execute(sql.raw(`ALTER TYPE "role" ADD VALUE IF NOT EXISTS '${role}'`));
            console.log(`- Added role ${role} to DB enum`);
        }

        console.log('--- Creating New Tables ---');
        // Team Members
        await db.execute(sql.raw(`
            CREATE TABLE IF NOT EXISTS "team_members" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "name" text NOT NULL,
                "role" text NOT NULL,
                "bio" text,
                "image" text,
                "social_links" jsonb DEFAULT '{}',
                "created_at" timestamp DEFAULT now() NOT NULL
            );
        `));
        console.log('- Table team_members created/verified');

        // Impact Metrics
        await db.execute(sql.raw(`
            CREATE TABLE IF NOT EXISTS "impact_metrics" (
                "id" text PRIMARY KEY DEFAULT 'current_metrics',
                "acres_cultivated" integer DEFAULT 0,
                "farmers_supported" integer DEFAULT 0,
                "production_capacity" text DEFAULT '0 Tons',
                "updated_at" timestamp DEFAULT now()
            );
        `));
        console.log('- Table impact_metrics created/verified');

        // Investments
        await db.execute(sql.raw(`
            CREATE TABLE IF NOT EXISTS "investments" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "user_id" uuid NOT NULL REFERENCES "users"("id"),
                "amount" numeric(15, 2) NOT NULL,
                "type" text NOT NULL,
                "status" text DEFAULT 'pending',
                "yield_expected" numeric(5, 2),
                "created_at" timestamp DEFAULT now() NOT NULL
            );
        `));
        console.log('- Table investments created/verified');

        // Farm Monitoring Data
        await db.execute(sql.raw(`
            CREATE TABLE IF NOT EXISTS "farm_monitoring_data" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "farmer_id" uuid NOT NULL REFERENCES "users"("id"),
                "crop_id" uuid REFERENCES "harvests"("id"),
                "data_points" jsonb NOT NULL,
                "recorded_at" timestamp DEFAULT now() NOT NULL
            );
        `));
        console.log('- Table farm_monitoring_data created/verified');

        console.log('--- DB sync finished ---');
    } catch (err) {
        console.error('Error syncing DB:', err);
    }
    process.exit(0);
}

run();

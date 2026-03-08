const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function fixSchema() {
    console.log("Adding trackingId column to products table...");
    try {
        await sql`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "tracking_id" text;`;
        console.log("Column added successfully.");

        console.log("Creating user_cards table...");
        await sql`
            CREATE TABLE IF NOT EXISTS "user_cards" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "user_id" text NOT NULL,
                "card_brand" text NOT NULL,
                "last4" text NOT NULL,
                "expiry_month" integer NOT NULL,
                "expiry_year" integer NOT NULL,
                "is_default" boolean DEFAULT false,
                "created_at" timestamp DEFAULT now()
            );
        `;
        console.log("Table created successfully.");
    } catch (err) {
        console.error("Failed to fix schema:", err);
    }
    process.exit(0);
}

fixSchema();

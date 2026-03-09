const { neon } = require("@neondatabase/serverless");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function init20() {
    console.log("🚀 Initializing Kido Farms 2.0 Database Extensions...");

    try {
        // 1. Stories
        console.log("Creating 'stories' table...");
        await sql`
            CREATE TABLE IF NOT EXISTS "stories" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "vendor_id" uuid NOT NULL REFERENCES "users"("id"),
                "media_url" text NOT NULL,
                "media_type" text DEFAULT 'image',
                "caption" text,
                "created_at" timestamp DEFAULT now()
            );
        `;

        // 2. Wallets
        console.log("Creating 'wallets' table...");
        await sql`
            CREATE TABLE IF NOT EXISTS "wallets" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "user_id" uuid NOT NULL UNIQUE REFERENCES "users"("id"),
                "balance" numeric(12, 2) DEFAULT 0.00,
                "currency" text DEFAULT 'NGN',
                "updated_at" timestamp DEFAULT now()
            );
        `;

        // 3. Wallet Transactions
        console.log("Creating 'wallet_transactions' table...");
        await sql`
            CREATE TABLE IF NOT EXISTS "wallet_transactions" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "wallet_id" uuid NOT NULL REFERENCES "wallets"("id"),
                "type" text NOT NULL,
                "amount" numeric(12, 2) NOT NULL,
                "description" text,
                "created_at" timestamp DEFAULT now()
            );
        `;

        // 4. Group Buys
        console.log("Creating 'group_buys' table...");
        await sql`
            CREATE TABLE IF NOT EXISTS "group_buys" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "product_id" uuid NOT NULL REFERENCES "products"("id"),
                "target_quantity" integer NOT NULL,
                "current_quantity" integer DEFAULT 0,
                "expiry_date" timestamp NOT NULL,
                "status" text DEFAULT 'active',
                "created_at" timestamp DEFAULT now()
            );
        `;

        // 5. Group Buy Participants
        console.log("Creating 'group_buy_participants' table...");
        await sql`
            CREATE TABLE IF NOT EXISTS "group_buy_participants" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "group_buy_id" uuid NOT NULL REFERENCES "group_buys"("id"),
                "user_id" uuid NOT NULL REFERENCES "users"("id"),
                "quantity" integer NOT NULL,
                "paid_status" boolean DEFAULT false,
                "created_at" timestamp DEFAULT now()
            );
        `;

        // 6. Notifications
        console.log("Creating 'notifications' table...");
        await sql`
            CREATE TABLE IF NOT EXISTS "notifications" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "user_id" uuid NOT NULL REFERENCES "users"("id"),
                "title" text NOT NULL,
                "message" text NOT NULL,
                "type" text DEFAULT 'info',
                "is_read" boolean DEFAULT false,
                "created_at" timestamp DEFAULT now()
            );
        `;

        // 7. Sensors
        console.log("Creating 'sensors' table...");
        await sql`
            CREATE TABLE IF NOT EXISTS "sensors" (
                "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                "entity_id" uuid NOT NULL,
                "type" text NOT NULL,
                "value" text NOT NULL,
                "status" text DEFAULT 'normal',
                "updated_at" timestamp DEFAULT now()
            );
        `;

        console.log("\n✨ Kido Farms 2.0 Database Infrastructure is READY.");
    } catch (err) {
        console.error("❌ Failed to initialize 2.0 schema:", err);
    }
    process.exit(0);
}

init20();

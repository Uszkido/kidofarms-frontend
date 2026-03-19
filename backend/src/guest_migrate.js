const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
    const sql = neon(process.env.DATABASE_URL);
    try {
        console.log("Upgrading orders table for Guest Checkout...");
        // Making userId nullable
        await sql`ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;`;
        // Adding name, email, phone for guests
        await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_name TEXT;`;
        await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_email TEXT;`;
        await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_phone TEXT;`;
        console.log("Migration successful: Added guest columns and made userId optional.");
    } catch (err) {
        console.error("Migration failed:", err.message);
    }
}

migrate();

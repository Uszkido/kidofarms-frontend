const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function migrate() {
    const sqlBuffer = neon(process.env.DATABASE_URL);
    try {
        console.log("Checking orders table...");
        // Bypassing tagged template for a simple DDL
        await sqlBuffer(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS paystack_reference TEXT;`);
        console.log("Migration successful: added paystack_reference column.");
    } catch (err) {
        // If it still fails on function call, try the tagged template approach correctly
        try {
            const sql = neon(process.env.DATABASE_URL);
            await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS paystack_reference TEXT;`;
            console.log("Migration successful (tagged template): added paystack_reference column.");
        } catch (innerErr) {
            console.error("Migration failed:", innerErr.message);
        }
    }
}

migrate();

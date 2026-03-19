const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function check() {
    const sql = neon(process.env.DATABASE_URL);
    try {
        const columns = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'orders'`;
        console.log("Columns in orders:", columns.map(c => c.column_name).join(", "));

        const required = ['paystack_reference', 'tracking_id', 'referral_code', 'payment_status', 'order_status', 'escrow_status'];
        for (const col of required) {
            if (!columns.some(c => c.column_name === col)) {
                console.log(`Missing column: ${col}. Adding it...`);
                // Standardizing types based on schema
                if (col === 'paystack_reference' || col === 'tracking_id' || col === 'referral_code' || col === 'escrow_status') {
                    await sql(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS ${col} TEXT;`);
                }
            }
        }
        console.log("Migration check complete.");
    } catch (err) {
        console.error("Check failed:", err.message);
    }
}

check();

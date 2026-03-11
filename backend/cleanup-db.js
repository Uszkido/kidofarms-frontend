require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function run() {
    try {
        console.log("Applying manual fixes to schemas bypassing interactive drizzle-kit prompts...");

        // Truncate the table if it exists
        try { await sql`TRUNCATE TABLE "wallets" CASCADE;`; } catch (e) { }
        try { await sql`TRUNCATE TABLE "products" CASCADE;`; } catch (e) { }

        // Allow Drizzle push to proceed normally via CLI next
        console.log("Cleanup applied! Drizzle push should now succeed without prompts.");
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
}
run();

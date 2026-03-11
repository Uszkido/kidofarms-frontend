require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function run() {
    try {
        console.log("Applying emergency schema patch to users table...");

        await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_verified" boolean DEFAULT false;`;
        await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "verification_mark" text;`;
        await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "permissions" jsonb DEFAULT '[]'::jsonb;`;

        console.log("Patch applied! Login should now proceed.");
        process.exit(0);
    } catch (error) {
        console.error("Patch failed:", error);
        process.exit(1);
    }
}
run();

require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { migrate } = require('drizzle-orm/neon-http/migrator');

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function run() {
    try {
        console.log("Running migrations...");
        await migrate(db, { migrationsFolder: "drizzle" });
        console.log("Migrations complete!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}
run();

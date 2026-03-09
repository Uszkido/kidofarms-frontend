require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function run() {
    const sql = neon(process.env.DATABASE_URL);
    try {
        await sql`ALTER TYPE role ADD VALUE IF NOT EXISTS 'vendor'`;
        console.log("Enum 'vendor' added successfully");

        // Convert the old 'vendor@kido.com' which was a farmer into a vendor
        await sql`UPDATE users SET role = 'vendor' WHERE email = 'vendor@kido.com'`;
        console.log("Existing vendor user updated");
    } catch (err) {
        console.error(err);
    }
}
run();

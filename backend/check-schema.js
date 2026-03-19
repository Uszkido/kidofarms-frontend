require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function check() {
    const sql = neon(process.env.DATABASE_URL);
    try {
        const columns = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'storage_nodes'`;
        console.log(columns.map(c => c.column_name).join(', '));
    } catch (err) {
        console.error(err);
    }
}

check();

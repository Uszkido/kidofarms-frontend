require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function check() {
    const sql = neon(process.env.DATABASE_URL);
    try {
        const result = await sql`SELECT * FROM blog_posts`;
        console.log(result);
    } catch (err) {
        console.error(err.message);
    }
}

check();

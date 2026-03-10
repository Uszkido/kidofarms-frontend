require('dotenv').config();
const { db } = require('./src/db');
const { sql } = require('drizzle-orm');

async function run() {
    try {
        const units = ['head', 'bunch', 'pack', 'bag', 'crate'];
        for (const unit of units) {
            await db.execute(sql.raw(`ALTER TYPE unit ADD VALUE IF NOT EXISTS '${unit}'`));
            console.log(`Added unit ${unit} to DB enum`);
        }
    } catch (err) {
        console.error('Error updating unit enum:', err);
    }
    process.exit(0);
}

run();

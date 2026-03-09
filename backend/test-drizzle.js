const { db } = require('./src/db');
const { harvests } = require('./src/db/schema');

async function test() {
    const data = await db.select().from(harvests);
    console.log(data);
    process.exit(0);
}

test().catch(console.error);

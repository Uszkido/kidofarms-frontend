require('dotenv').config();
const { db } = require('./src/db');
const { landingSections } = require('./src/db/schema');

async function test() {
    console.log('Starting test...');
    console.log('landingSections defined:', !!landingSections);

    try {
        const sections = await db.select().from(landingSections);
        console.log('Sections count:', sections.length);
        console.log('Data:', JSON.stringify(sections, null, 2));
    } catch (e) {
        console.error('FETCH ERROR:', e);
        console.error('Stack:', e.stack);
    }
}

test();

require('dotenv').config();
const { db } = require('./src/db');
const { users } = require('./src/db/schema');
const bcrypt = require('bcryptjs');
const { sql } = require('drizzle-orm');

async function run() {
    console.log('--- Attempting Manual DB Update ---');
    try {
        // Handle enum change manually if possible
        // Note: Drizzle's sql template tag is best for this
        await db.execute(sql`ALTER TYPE "role" ADD VALUE IF NOT EXISTS 'subscriber'`);
        console.log('- Success: Role enum updated with "subscriber"');
    } catch (err) {
        console.log('- Note: Could not update enum via SQL (might already exist or permission restricted):', err.message);
    }

    console.log('--- Re-Seeding Demo Accounts ---');
    const demoUsers = [
        { name: 'Kido Admin', email: 'admin@kido.com', password: 'kido-admin-2026', role: 'admin' },
        { name: 'Kano Valley Farmer', email: 'vendor@kido.com', password: 'kido-vendor-2026', role: 'farmer' },
        { name: 'Elite Subscriber', email: 'subscriber@kido.com', password: 'kido-sub-2026', role: 'subscriber' },
        { name: 'Happy Shopper', email: 'shopper@kido.com', password: 'kido-shop-2026', role: 'customer' }
    ];

    for (const user of demoUsers) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await db.insert(users).values({
                ...user,
                password: hashedPassword
            }).onConflictDoUpdate({
                target: users.email,
                set: { role: user.role, password: hashedPassword }
            });
            console.log(`- Success: ${user.name} (${user.role})`);
        } catch (err) {
            console.error(`- Error seeding ${user.email}:`, err.message);
        }
    }
    console.log('--- Process Complete ---');
    process.exit(0);
}

run();

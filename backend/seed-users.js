require('dotenv').config();
const { db } = require('./src/db');
const { users } = require('./src/db/schema');
const bcrypt = require('bcryptjs');

async function seed() {
    console.log('--- Seeding Demo Accounts ---');
    const demoUsers = [
        { name: 'Kido Admin', email: 'admin@kido.com', password: 'kido-admin-2026', role: 'admin' },
        { name: 'Kano Valley Farmer', email: 'farmer@kido.com', password: 'kido-farmer-2026', role: 'farmer' },
        { name: 'Kido Store Vendor', email: 'vendor@kido.com', password: 'kido-vendor-2026', role: 'vendor' },
        { name: 'Elite Subscriber', email: 'subscriber@kido.com', password: 'kido-sub-2026', role: 'subscriber' },
        { name: 'Happy Shopper', email: 'shopper@kido.com', password: 'kido-shop-2026', role: 'customer' }
    ];

    for (const user of demoUsers) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await db.insert(users).values({
                ...user,
                password: hashedPassword
            }).onConflictDoNothing({ target: users.email });
            console.log(`- Success: ${user.name} (${user.role})`);
        } catch (err) {
            console.error(`- Error seeding ${user.email}:`, err.message);
        }
    }
    console.log('--- Seeding Complete ---');
    process.exit(0);
}

seed();

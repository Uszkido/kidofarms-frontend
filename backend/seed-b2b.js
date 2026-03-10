require('dotenv').config();
const { db } = require('./src/db');
const { users } = require('./src/db/schema');
const bcrypt = require('bcryptjs');

async function seedB2B() {
    console.log('--- Seeding B2B & Role Ecosystem Accounts ---');
    const demoUsers = [
        { name: 'Grand Horizon Hotel', email: 'hotel@kido.com', password: 'kido-hotel-2026', role: 'business' },
        { name: 'Express Logistics Node', email: 'distributor@kido.com', password: 'kido-dist-2026', role: 'distributor' },
        { name: 'Central Retail Hub', email: 'retailer@kido.com', password: 'kido-retail-2026', role: 'retailer' },
        { name: 'Bulk Ops Wholesaler', email: 'wholesaler@kido.com', password: 'kido-wholesale-2026', role: 'wholesale_buyer' },
        { name: 'Task Agent Alpha', email: 'team@kido.com', password: 'kido-team-2026', role: 'team_member' }
    ];

    for (const user of demoUsers) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await db.insert(users).values({
                ...user,
                password: hashedPassword
            }).onConflictDoNothing({ target: users.email });
            console.log(`- Success: ${user.name} (${user.role})`);
            console.log(`  Login: ${user.email} / ${user.password}`);
        } catch (err) {
            console.error(`- Error seeding ${user.email}:`, err.message);
        }
    }
    console.log('--- B2B Seeding Complete ---');
    process.exit(0);
}

seedB2B();

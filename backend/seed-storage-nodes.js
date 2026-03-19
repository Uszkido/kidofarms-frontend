require('dotenv').config();
const { db } = require('./src/db');
const { storageNodes } = require('./src/db/schema');

async function seed() {
    console.log('Seeding storage nodes...');
    try {
        await db.insert(storageNodes).values([
            { name: 'Lagos Main Hub', location: 'Lagos Bypass 12', type: 'distribution_hub', capacity: 5000, status: 'Optimal', temperature: '4.2', humidity: '45', lastAlert: null },
            { name: 'Abuja Cold Store', location: 'FCT Node Alpha', type: 'cold_storage', capacity: 2000, status: 'High Demand', temperature: '-2.1', humidity: '38', lastAlert: 'Temp fluctuating' },
            { name: 'Kano Central Dist', location: 'Kano Industrial Zone', type: 'distribution_hub', capacity: 3500, status: 'Stable', temperature: '5.5', humidity: '50', lastAlert: null },
            { name: 'Port Harcourt Auth', location: 'Rivers Hub Beta', type: 'cold_storage', capacity: 1500, status: 'Optimal', temperature: '-3.0', humidity: '35', lastAlert: null }
        ]);
        console.log('Storage nodes seeded successfully!');
    } catch (err) {
        console.error('Error seeding storage nodes:', err);
    }
    process.exit(0);
}
seed();

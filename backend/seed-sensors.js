const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const { db } = require('./src/db');
const { sensors } = require('./src/db/schema');

async function seedSensors() {
    console.log("📡 Seeding IoT Sensors...");
    try {
        const dummyEntityId = "00000000-0000-0000-0000-000000000000"; // Global or default harvest

        const sensorData = [
            {
                entityId: dummyEntityId,
                type: 'moisture',
                value: '72',
                status: 'normal',
                updatedAt: new Date()
            },
            {
                entityId: dummyEntityId,
                type: 'temperature',
                value: '22.5',
                status: 'normal',
                updatedAt: new Date()
            },
            {
                entityId: dummyEntityId,
                type: 'humidity',
                value: '58',
                status: 'normal',
                updatedAt: new Date()
            }
        ];

        await db.insert(sensors).values(sensorData);
        console.log("✅ Successfully seeded 3 sensor nodes.");
    } catch (err) {
        console.error("❌ Sensor seed failed:", err);
    }
    process.exit(0);
}

seedSensors();

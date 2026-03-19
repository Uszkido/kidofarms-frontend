const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { sensors } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const { sendSensorAlert } = require('../lib/bot');

// GET /api/sensors (Get latest sensor readings for a farm/harvest)
router.get('/', async (req, res) => {
    try {
        const data = await db.select()
            .from(sensors)
            .orderBy(desc(sensors.updatedAt))
            .limit(20);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch sensor data' });
    }
});

// POST /api/sensors (IoT device ingestion simulation)
router.post('/ingest', async (req, res) => {
    const { entityId, type, value, status } = req.body;
    try {
        const [newSensor] = await db.insert(sensors).values({
            entityId,
            type,
            value,
            status: status || 'normal',
            updatedAt: new Date()
        }).returning();

        // Send Alert if non-normal status
        if (newSensor.status !== 'normal') {
            await sendSensorAlert(newSensor);
        }

        res.status(201).json(newSensor);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Ingestion failed' });
    }
});

module.exports = router;

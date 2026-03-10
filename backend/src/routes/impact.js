const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { impactMetrics } = require('../db/schema');
const { eq } = require('drizzle-orm');

// GET impact metrics
router.get('/', async (req, res) => {
    try {
        const data = await db.query.impactMetrics.findFirst({
            where: eq(impactMetrics.id, 'current_metrics')
        });
        res.json(data || { acresCultivated: 0, farmersSupported: 0, productionCapacity: '0 Tons' });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Admin: Update impact metrics
router.put('/', async (req, res) => {
    try {
        const [metrics] = await db.insert(impactMetrics).values({
            id: 'current_metrics',
            ...req.body,
            updatedAt: new Date()
        }).onConflictDoUpdate({
            target: impactMetrics.id,
            set: { ...req.body, updatedAt: new Date() }
        }).returning();
        res.json(metrics);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

module.exports = router;

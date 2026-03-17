const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { energyMarketplace, circularLogs, wallets, activityLogs } = require('../db/schema');
const { eq, desc, sql } = require('drizzle-orm');
const { authenticateToken } = require('../middleware/authMiddleware');

// 1. GET /api/energy - Get available listings in the Sovereign Energy Marketplace
router.get('/', async (req, res) => {
    try {
        const listings = await db.select().from(energyMarketplace).where(eq(energyMarketplace.status, 'available')).orderBy(desc(energyMarketplace.createdAt));
        res.json(listings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve energy nodes' });
    }
});

// 2. POST /api/energy/list - Offer biomass waste for sale/credits
router.post('/list', authenticateToken, async (req, res) => {
    const { wasteType, quantity, unit, creditsOffered } = req.body;
    try {
        const [inserted] = await db.insert(energyMarketplace).values({
            sellerId: req.user.id,
            wasteType,
            quantity: sql`${quantity}`,
            unit: unit || 'kg',
            creditsOffered: creditsOffered || Math.floor(quantity / 10),
            status: 'available'
        }).returning();

        await db.insert(activityLogs).values({
            action: 'ENERGY_LIST_WASTE',
            entity: 'energy_marketplace',
            details: { id: inserted.id, wasteType, quantity },
            userId: req.user.id
        });

        res.status(201).json(inserted);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list biomass' });
    }
});

// 3. GET /api/energy/logs - Get citizen's circular economy history
router.get('/logs', authenticateToken, async (req, res) => {
    try {
        const logs = await db.select().from(circularLogs).where(eq(circularLogs.userId, req.user.id)).orderBy(desc(circularLogs.createdAt));
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch circular logs' });
    }
});

module.exports = router;

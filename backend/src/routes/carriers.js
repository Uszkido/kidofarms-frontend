const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { carriers, users, activityLogs } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// 1. GET /api/carriers/profile - Get current carrier's profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const carrier = await db.query.carriers.findFirst({ where: eq(carriers.userId, req.user.id) });
        if (!carrier) return res.status(404).json({ error: 'Carrier node not found' });
        res.json(carrier);
    } catch (error) {
        res.status(500).json({ error: 'Failed to access carrier registry' });
    }
});

// 2. POST /api/carriers/register - Register as a carrier node
router.post('/register', authenticateToken, async (req, res) => {
    const { companyName, vehicleType, coverageArea, hasColdChain, bankName, accountNumber, accountName } = req.body;
    try {
        const [inserted] = await db.insert(carriers).values({
            userId: req.user.id,
            companyName,
            vehicleType,
            coverageArea,
            hasColdChain: !!hasColdChain,
            bankName,
            accountNumber,
            accountName,
            status: 'pending'
        }).returning();

        // Update user role
        await db.update(users).set({ role: 'carrier' }).where(eq(users.id, req.user.id));

        await db.insert(activityLogs).values({
            action: 'CARRIER_NODE_REGISTER',
            entity: 'carriers',
            details: { id: inserted.id, vehicleType, coverageArea },
            userId: req.user.id
        });

        res.status(201).json(inserted);
    } catch (error) {
        res.status(500).json({ error: 'Failed to synchronize carrier node' });
    }
});

// 3. GET /api/carriers - List all carriers (Admin only)
router.get('/', authenticateToken, authorizeRoles('admin', 'sub-admin'), async (req, res) => {
    try {
        const allCarriers = await db.select().from(carriers).orderBy(desc(carriers.createdAt));
        res.json(allCarriers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch carriers registry' });
    }
});

module.exports = router;

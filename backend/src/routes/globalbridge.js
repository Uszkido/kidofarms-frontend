const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { globalBridge, activityLogs } = require('../db/schema');
const { eq, desc, sql } = require('drizzle-orm');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// 1. GET /api/globalbridge - View all export requests (Admin/Farmer side)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const query = db.select().from(globalBridge).orderBy(desc(globalBridge.createdAt));
        if (req.user.role !== 'admin' && req.user.role !== 'sub-admin') {
            query.where(eq(globalBridge.farmerId, req.user.id));
        }
        const exports = await query;
        res.json(exports);
    } catch (error) {
        res.status(500).json({ error: 'Failed to access global bridge node' });
    }
});

// 2. POST /api/globalbridge/request - Farmer requests export certification
router.post('/request', authenticateToken, async (req, res) => {
    const { produceType, quantity, destination } = req.body;
    try {
        const [inserted] = await db.insert(globalBridge).values({
            farmerId: req.user.id,
            produceType,
            quantity: sql`${quantity}`,
            destination,
            certifications: [],
            status: 'certification_pending'
        }).returning();

        await db.insert(activityLogs).values({
            action: 'EXPORT_REQUEST',
            entity: 'global_bridge',
            details: { id: inserted.id, destination, produceType },
            userId: req.user.id
        });

        res.status(201).json(inserted);
    } catch (error) {
        res.status(500).json({ error: 'Failed to initiate export bridge' });
    }
});

// 3. PATCH /api/globalbridge/:id/certify - Admin/Staff adds certifications and updates status
router.patch('/:id/certify', authenticateToken, authorizeRoles('admin', 'sub-admin', 'team_member'), async (req, res) => {
    const { id } = req.params;
    const { certifications, status } = req.body; // e.g. status: 'certified', certifications: ['ISO', 'Organic']
    try {
        const [updated] = await db.update(globalBridge)
            .set({
                status: status || 'certified',
                certifications: certifications || [],
                updatedAt: new Date()
            })
            .where(eq(globalBridge.id, id))
            .returning();

        await db.insert(activityLogs).values({
            action: 'EXPORT_CERTIFY',
            entity: 'global_bridge',
            details: { id, certifications, status },
            userId: req.user.id
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to certify export node' });
    }
});

module.exports = router;

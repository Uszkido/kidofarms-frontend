const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { groupBuys, groupBuyParticipants, products } = require('../db/schema');
const { eq, and, sql } = require('drizzle-orm');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/groupbuys (List active group buys)
router.get('/', async (req, res) => {
    try {
        const data = await db.query.groupBuys.findMany({
            with: { product: true, participants: true },
            where: eq(groupBuys.status, 'active')
        });
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

// POST /api/groupbuys/join (Join or Create a group buy)
router.post('/join', authenticateToken, async (req, res) => {
    const { productId, userId, quantity } = req.body;
    try {
        // Find an active group buy for this product
        let [activeGroup] = await db.select()
            .from(groupBuys)
            .where(and(eq(groupBuys.productId, productId), eq(groupBuys.status, 'active')))
            .limit(1);

        if (!activeGroup) {
            // Create a new group buy if none exists
            const [newGroup] = await db.insert(groupBuys).values({
                productId,
                targetQuantity: 100, // Default target
                expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
            }).returning();
            activeGroup = newGroup;
        }

        // Add participant
        await db.insert(groupBuyParticipants).values({
            groupBuyId: activeGroup.id,
            userId,
            quantity
        });

        // Update current quantity
        await db.update(groupBuys)
            .set({
                currentQuantity: sql`${groupBuys.currentQuantity} + ${quantity}`
            })
            .where(eq(groupBuys.id, activeGroup.id));

        res.json({ message: 'Joined successfully', groupId: activeGroup.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to join' });
    }
});

module.exports = router;

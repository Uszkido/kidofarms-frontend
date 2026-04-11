const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { subscribers } = require('../db/schema');
const { desc } = require('drizzle-orm');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const data = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// POST /api/subscribers
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { email, phone, street, city, state, zip, plan, userId } = req.body;

        // Check if subscriber already exists
        const { eq } = require('drizzle-orm');
        const existing = await db.select().from(subscribers).where(eq(subscribers.email, email));

        if (existing.length > 0) {
            // Update existing subscriber
            const [updated] = await db.update(subscribers)
                .set({ phone, street, city, state, zip, plan, userId, status: 'active', paymentStatus: 'paid' })
                .where(eq(subscribers.email, email))
                .returning();
            return res.json(updated);
        }

        const [sub] = await db.insert(subscribers).values({
            email, phone, street, city, state, zip, plan, userId,
            status: 'active',
            paymentStatus: 'paid'
        }).returning();

        res.status(201).json(sub);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to process subscription' });
    }
});

// PATCH /api/subscribers/:id
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        const { eq } = require('drizzle-orm');
        const [updated] = await db.update(subscribers)
            .set(req.body)
            .where(eq(subscribers.id, req.params.id))
            .returning();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// DELETE /api/subscribers/:id
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { eq } = require('drizzle-orm');
        await db.delete(subscribers).where(eq(subscribers.id, req.params.id));
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

module.exports = router;

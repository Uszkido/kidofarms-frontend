const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { subscribers } = require('../db/schema');
const { desc } = require('drizzle-orm');

router.get('/', async (req, res) => {
    try {
        const data = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// POST /api/subscribers
router.post('/', async (req, res) => {
    try {
        const [sub] = await db.insert(subscribers).values(req.body).returning();
        res.status(201).json(sub);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// PATCH /api/subscribers/:id
router.patch('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
    try {
        const { eq } = require('drizzle-orm');
        await db.delete(subscribers).where(eq(subscribers.id, req.params.id));
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

module.exports = router;

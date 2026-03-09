const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { userCards } = require('../db/schema');
const { eq } = require('drizzle-orm');

// GET /api/cards?userId=...
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'userId is required' });

        const cards = await db.select().from(userCards).where(eq(userCards.userId, userId));
        res.json(cards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
});

// POST /api/cards
router.post('/', async (req, res) => {
    try {
        const [card] = await db.insert(userCards).values(req.body).returning();
        res.status(201).json(card);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to save card' });
    }
});

// DELETE /api/cards/:id
router.delete('/:id', async (req, res) => {
    try {
        await db.delete(userCards).where(eq(userCards.id, req.params.id));
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;

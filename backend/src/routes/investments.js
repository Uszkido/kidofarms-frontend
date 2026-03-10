const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { investments, users } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');

// GET all investments (for Admin)
router.get('/', async (req, res) => {
    try {
        const data = await db.select().from(investments).orderBy(desc(investments.createdAt));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// GET user investments
router.get('/user/:userId', async (req, res) => {
    try {
        const data = await db.select().from(investments)
            .where(eq(investments.userId, req.params.userId))
            .orderBy(desc(investments.createdAt));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// POST new investment
router.post('/', async (req, res) => {
    try {
        const [inv] = await db.insert(investments).values(req.body).returning();
        res.status(201).json(inv);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// PATCH update investment status (Admin)
router.patch('/:id', async (req, res) => {
    try {
        const [inv] = await db.update(investments)
            .set(req.body)
            .where(eq(investments.id, req.params.id))
            .returning();
        res.json(inv);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

module.exports = router;

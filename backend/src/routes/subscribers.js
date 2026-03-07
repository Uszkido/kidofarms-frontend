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

router.post('/', async (req, res) => {
    try {
        const [sub] = await db.insert(subscribers).values(req.body).returning();
        res.status(201).json(sub);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { users } = require('../db/schema');
const { desc } = require('drizzle-orm');

router.get('/', async (req, res) => {
    try {
        const data = await db.select().from(users).orderBy(desc(users.createdAt));
        const safe = data.map(({ password, ...rest }) => rest);
        res.json(safe);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// POST /api/users
router.post('/', async (req, res) => {
    try {
        const [user] = await db.insert(users).values(req.body).returning();
        const { password, ...safe } = user;
        res.status(201).json(safe);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// PATCH /api/users/:id
router.patch('/:id', async (req, res) => {
    try {
        const { eq } = require('drizzle-orm');
        const [user] = await db.update(users)
            .set(req.body)
            .where(eq(users.id, req.params.id))
            .returning();
        const { password, ...safe } = user;
        res.json(safe);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
    try {
        const { eq } = require('drizzle-orm');
        await db.delete(users).where(eq(users.id, req.params.id));
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;

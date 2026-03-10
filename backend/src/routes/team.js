const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { teamMembers } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');

// GET all team members
router.get('/', async (req, res) => {
    try {
        const data = await db.select().from(teamMembers).orderBy(desc(teamMembers.createdAt));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// Admin: Create/Edit/Delete
router.post('/', async (req, res) => {
    try {
        const [member] = await db.insert(teamMembers).values(req.body).returning();
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const [member] = await db.update(teamMembers)
            .set(req.body)
            .where(eq(teamMembers.id, req.params.id))
            .returning();
        res.json(member);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.delete(teamMembers).where(eq(teamMembers.id, req.params.id));
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;

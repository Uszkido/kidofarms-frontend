const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { teamMembers, tasks, users } = require('../db/schema');
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

// Tasks Routes
router.delete('/:id', async (req, res) => {
    try {
        await db.delete(teamMembers).where(eq(teamMembers.id, req.params.id));
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

router.get('/tasks/all', async (req, res) => {
    try {
        const { userId } = req.query;
        let query;
        if (userId) {
            query = db.select().from(tasks).where(eq(tasks.assignedToId, userId)).orderBy(desc(tasks.createdAt));
        } else {
            query = db.select().from(tasks).orderBy(desc(tasks.createdAt));
        }

        const data = await query;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

router.post('/tasks', async (req, res) => {
    try {
        const [task] = await db.insert(tasks).values(req.body).returning();
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to create task' });
    }
});

router.patch('/tasks/:id', async (req, res) => {
    try {
        const [task] = await db.update(tasks).set(req.body).where(eq(tasks.id, req.params.id)).returning();
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update task' });
    }
});

module.exports = router;

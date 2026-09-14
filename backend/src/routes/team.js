const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { teamMembers, tasks, users } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken);

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
router.post('/', authorizeRoles('admin', 'sub-admin', 'team_member'), async (req, res) => {
    try {
        const [member] = await db.insert(teamMembers).values(req.body).returning();
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

router.patch('/:id', authorizeRoles('admin', 'sub-admin', 'team_member'), async (req, res) => {
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
router.delete('/:id', authorizeRoles('admin', 'sub-admin'), async (req, res) => {
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
        const canManageTasks = ['admin', 'sub-admin', 'team_member'].includes(req.user.role);
        if (userId && !canManageTasks && userId !== req.user.id) {
            return res.status(403).json({ error: 'You can only view your own tasks' });
        }
        let query;
        if (userId || !canManageTasks) {
            query = db.select().from(tasks).where(eq(tasks.assignedToId, userId || req.user.id)).orderBy(desc(tasks.createdAt));
        } else {
            query = db.select().from(tasks).orderBy(desc(tasks.createdAt));
        }

        const data = await query;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

router.post('/tasks', authorizeRoles('admin', 'sub-admin', 'team_member'), async (req, res) => {
    try {
        const { assignedToId, title, description, priority, dueDate } = req.body;
        if (!assignedToId || !title?.trim()) return res.status(400).json({ error: 'Assignee and title are required' });
        const [task] = await db.insert(tasks).values({
            assignedToId,
            assignedById: req.user.id,
            title: title.trim().slice(0, 200),
            description: description?.trim().slice(0, 5000) || null,
            priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
            dueDate: dueDate || null,
        }).returning();
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to create task' });
    }
});

router.patch('/tasks/:id', async (req, res) => {
    try {
        const [existing] = await db.select().from(tasks).where(eq(tasks.id, req.params.id)).limit(1);
        if (!existing) return res.status(404).json({ error: 'Task not found' });
        const canManageTasks = ['admin', 'sub-admin', 'team_member'].includes(req.user.role);
        if (!canManageTasks && existing.assignedToId !== req.user.id) {
            return res.status(403).json({ error: 'You can only update your own tasks' });
        }
        const updates = canManageTasks ? req.body : { status: req.body.status };
        if (updates.status && !['pending', 'in_progress', 'completed'].includes(updates.status)) {
            return res.status(400).json({ error: 'Invalid task status' });
        }
        const [task] = await db.update(tasks).set(updates).where(eq(tasks.id, req.params.id)).returning();
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update task' });
    }
});

module.exports = router;

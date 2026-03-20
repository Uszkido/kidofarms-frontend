const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { notifications } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');

// GET /api/notifications?userId=...
router.get('/', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    try {
        const data = await db.select()
            .from(notifications)
            .where(eq(notifications.userId, userId))
            .orderBy(desc(notifications.createdAt))
            .limit(20);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// PATCH /api/notifications/:id (Mark as read)
router.patch('/:id/read', async (req, res) => {
    try {
        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.id, req.params.id));
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    try {
        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.userId, userId));
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

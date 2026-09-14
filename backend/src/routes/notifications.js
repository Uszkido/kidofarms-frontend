const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { notifications } = require('../db/schema');
const { eq, desc, and } = require('drizzle-orm');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// GET /api/notifications?userId=...
router.get('/', async (req, res) => {
    try {
        const data = await db.select()
            .from(notifications)
            .where(eq(notifications.userId, req.user.id))
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
            .where(and(eq(notifications.id, req.params.id), eq(notifications.userId, req.user.id)));
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', async (req, res) => {
    try {
        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.userId, req.user.id));
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;

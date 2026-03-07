const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { activityLogs, users, settings } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');

// Get all activity logs
router.get('/logs', async (req, res) => {
    try {
        const logs = await db.select({
            id: activityLogs.id,
            action: activityLogs.action,
            entity: activityLogs.entity,
            details: activityLogs.details,
            createdAt: activityLogs.createdAt,
            userName: users.name
        })
            .from(activityLogs)
            .leftJoin(users, eq(activityLogs.userId, users.id))
            .orderBy(desc(activityLogs.createdAt))
            .limit(100);

        res.json(logs);
    } catch (error) {
        console.error('Logs Error:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

// Get system settings
router.get('/settings', async (req, res) => {
    try {
        const [config] = await db.select().from(settings).where(eq(settings.id, 'site_config'));
        res.json(config || {});
    } catch (error) {
        console.error('Settings Error:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Update system settings
router.patch('/settings', async (req, res) => {
    const data = req.body;
    try {
        await db.insert(settings)
            .values({ id: 'site_config', ...data })
            .onConflictDoUpdate({
                target: settings.id,
                set: { ...data, updatedAt: new Date() }
            });

        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Settings Update Error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

module.exports = router;

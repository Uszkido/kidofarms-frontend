const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { stories, users } = require('../db/schema');
const { desc, eq } = require('drizzle-orm');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// GET /api/stories (List all active stories)
router.get('/', async (req, res) => {
    try {
        const data = await db.select({
            id: stories.id,
            vendorId: stories.vendorId,
            mediaUrl: stories.mediaUrl,
            mediaType: stories.mediaType,
            caption: stories.caption,
            expiresAt: stories.expiresAt,
            createdAt: stories.createdAt,
            vendorName: users.name,
        })
            .from(stories)
            .leftJoin(users, eq(stories.vendorId, users.id))
            .orderBy(desc(stories.createdAt));
        // Keep the existing client shape but return only the public display name.
        res.json(data.map(({ vendorName, ...story }) => ({
            ...story,
            vendor: { name: vendorName || 'Kido Farm' },
        })));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
});

// POST /api/stories (Admin/Vendor post)
router.post('/', authenticateToken, authorizeRoles('admin', 'sub-admin', 'vendor', 'farmer'), async (req, res) => {
    try {
        const { mediaUrl, mediaType, caption, expiresAt } = req.body;
        if (!mediaUrl) return res.status(400).json({ error: 'A story image is required.' });
        const [newStory] = await db.insert(stories).values({
            vendorId: req.user.id,
            mediaUrl,
            mediaType: mediaType || 'image',
            caption: typeof caption === 'string' ? caption.slice(0, 500) : null,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
        }).returning();
        res.status(201).json(newStory);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to post story' });
    }
});

// Seed some initial stories if empty
router.post('/seed', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const count = await db.select().from(stories);
        if (count.length === 0) {
            // Find a vendor to attach stories to
            const [vendor] = await db.select().from(users).where(eq(users.role, 'vendor')).limit(1);
            if (!vendor) return res.status(404).json({ error: 'No vendors found to seed stories' });

            const seedData = [
                {
                    vendorId: vendor.id,
                    mediaUrl: "https://images.unsplash.com/photo-1595841696650-6ed676d15bd3?auto=format&fit=crop&q=80",
                    caption: "Just started the morning harvest in Kano! 🌽",
                    mediaType: "image"
                },
                {
                    vendorId: vendor.id,
                    mediaUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80",
                    caption: "Look at the extraction quality on this Wild Honey 🍯",
                    mediaType: "image"
                }
            ];
            await db.insert(stories).values(seedData);
        }
        res.json({ message: 'Stories seeded' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Seed failed' });
    }
});

// DELETE /api/stories/:id
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const [story] = await db.select().from(stories).where(eq(stories.id, req.params.id)).limit(1);
        if (!story) return res.status(404).json({ error: 'Story not found' });
        if (req.user.role !== 'admin' && req.user.role !== 'sub-admin' && story.vendorId !== req.user.id) {
            return res.status(403).json({ error: 'You can only remove your own story.' });
        }
        await db.delete(stories).where(eq(stories.id, req.params.id));
        res.json({ message: 'Story deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete story' });
    }
});

module.exports = router;

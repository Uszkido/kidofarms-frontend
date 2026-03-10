const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { stories, users } = require('../db/schema');
const { desc, eq } = require('drizzle-orm');

// GET /api/stories (List all active stories)
router.get('/', async (req, res) => {
    try {
        const data = await db.query.stories.findMany({
            with: { vendor: true },
            orderBy: [desc(stories.createdAt)]
        });
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
});

// POST /api/stories (Admin/Vendor post)
router.post('/', async (req, res) => {
    try {
        const [newStory] = await db.insert(stories).values(req.body).returning();
        res.status(201).json(newStory);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to post story' });
    }
});

// Seed some initial stories if empty
router.post('/seed', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
    try {
        await db.delete(stories).where(eq(stories.id, req.params.id));
        res.json({ message: 'Story deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete story' });
    }
});

module.exports = router;

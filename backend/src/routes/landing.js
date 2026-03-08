const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { landingSections } = require('../db/schema');
const { eq } = require('drizzle-orm');

// Get all landing sections
router.get('/', async (req, res) => {
    try {
        const sections = await db.select().from(landingSections);
        const config = sections.reduce((acc, section) => {
            acc[section.id] = section.content;
            return acc;
        }, {});
        res.json(config);
    } catch (error) {
        console.error('Landing API Error:', error);
        res.status(500).json({ error: 'Failed to fetch landing content' });
    }
});

// Update a specific section
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        await db.insert(landingSections)
            .values({ id, content })
            .onConflictDoUpdate({
                target: landingSections.id,
                set: { content, updatedAt: new Date() }
            });
        res.json({ message: `Section ${id} updated`, content });
    } catch (error) {
        console.error('Landing API Update Error:', error);
        res.status(500).json({ error: 'Failed to update landing content' });
    }
});

module.exports = router;

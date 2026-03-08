const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { harvests } = require('../db/schema');
const { desc, eq } = require('drizzle-orm');

// GET /api/harvests
router.get('/', async (req, res) => {
    try {
        const data = await db.select().from(harvests).orderBy(desc(harvests.updatedAt));
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch harvests' });
    }
});

// POST /api/harvests (Admin only - placeholder)
router.post('/', async (req, res) => {
    try {
        const [harvest] = await db.insert(harvests).values(req.body).returning();
        res.status(201).json(harvest);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to create harvest' });
    }
});

// PATCH /api/harvests/:id
router.patch('/:id', async (req, res) => {
    try {
        const [updated] = await db.update(harvests)
            .set(req.body)
            .where(eq(harvests.id, req.params.id))
            .returning();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// Seed some initial harvests if empty
router.post('/init', async (req, res) => {
    try {
        const count = await db.select().from(harvests);
        if (count.length === 0) {
            const initialData = [
                { cropName: 'Sweet Maize', farmName: 'Kano Valley Organics', region: 'Kano', status: 'harvesting', progress: 95, estimatedReadyDate: new Date() },
                { cropName: 'Red Habanero', farmName: 'Plateau Greens', region: 'Jos', status: 'growing', progress: 65, estimatedReadyDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
                { cropName: 'Benue Yams', farmName: 'Riverbank Farms', region: 'Benue', status: 'planted', progress: 20, estimatedReadyDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }
            ];
            await db.insert(harvests).values(initialData);
        }
        res.json({ message: 'Harvests initialized' });
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;

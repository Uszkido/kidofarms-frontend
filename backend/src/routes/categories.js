const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { categories } = require('../db/schema');

const { eq } = require('drizzle-orm');

router.get('/', async (req, res) => {
    try {
        const data = await db.select().from(categories);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// POST /api/categories
router.post('/', async (req, res) => {
    try {
        const [category] = await db.insert(categories).values(req.body).returning();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// PATCH /api/categories/:id
router.patch('/:id', async (req, res) => {
    try {
        const [updated] = await db.update(categories)
            .set(req.body)
            .where(eq(categories.id, req.params.id))
            .returning();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
    try {
        await db.delete(categories).where(eq(categories.id, req.params.id));
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

router.post('/init', async (req, res) => {
    try {
        const { products } = require('../db/schema');
        const { eq } = require('drizzle-orm');

        const newCats = [
            { name: 'Fishes', description: 'Freshwater and saltwater fish' },
            { name: 'Chicken', description: 'Organic farm-raised chicken' },
            { name: 'Beef', description: 'Premium grass-fed beef' },
            { name: 'Fruits', description: 'Seasonal fresh fruits' },
            { name: 'Vegetables', description: 'Organic vegetables' },
            { name: 'Grains', description: 'Local grains and cereals' }
        ];

        for (const cat of newCats) {
            await db.insert(categories).values(cat).onConflictDoNothing();
        }

        // Migrate existing Catfish products to Fishes if any
        await db.update(products)
            .set({ category: 'Fishes' })
            .where(eq(products.category, 'Catfish'));

        res.json({ message: 'Categories initialized successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;

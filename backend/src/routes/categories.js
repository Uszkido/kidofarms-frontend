const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { categories } = require('../db/schema');

const { eq } = require('drizzle-orm');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

const { withCache, cacheDel } = require('../lib/cache');

router.get('/', async (req, res) => {
    try {
        const data = await withCache('categories:all', async () => {
            return await db.select().from(categories);
        }, 120);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
});

// POST /api/categories (Protected)
router.post('/', authenticateToken, authorizeRoles('admin', 'sub-admin'), async (req, res) => {
    try {
        const [category] = await db.insert(categories).values(req.body).returning();
        await cacheDel('categories:all');
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// PATCH /api/categories/:id (Protected)
router.patch('/:id', authenticateToken, authorizeRoles('admin', 'sub-admin'), async (req, res) => {
    try {
        const [updated] = await db.update(categories)
            .set(req.body)
            .where(eq(categories.id, req.params.id))
            .returning();
        await cacheDel('categories:all');
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

// DELETE /api/categories/:id (Protected)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        await db.delete(categories).where(eq(categories.id, req.params.id));
        await cacheDel('categories:all');
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
            { name: 'Beef', description: 'Premium grass-fed beef' },
            { name: 'Fruits', description: 'Seasonal fresh fruits' },
            { name: 'Vegetables', description: 'Organic vegetables' },
            { name: 'Grains', description: 'Local grains and cereals' },
            { name: 'Herbs & Specialty Crops', description: 'Aromatic herbs and special crops' },
            { name: 'Livestock & Poultry Products', description: 'Chicken, turkey, eggs and more' },
            { name: 'Nuts & Other Produce', description: 'Nuts, seeds and other farm produce' }
        ];

        for (const cat of newCats) {
            await db.insert(categories).values(cat).onConflictDoNothing();
        }

        // Migrate categories
        await db.update(products)
            .set({ category: 'Fishes' })
            .where(eq(products.category, 'Catfish'));

        await db.update(products)
            .set({ category: 'Livestock & Poultry Products' })
            .where(eq(products.category, 'Chicken'));

        res.json({ message: 'Categories initialized successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;

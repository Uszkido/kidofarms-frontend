const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { productBundles } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', async (_req, res) => res.json(await db.select().from(productBundles).where(eq(productBundles.isActive, true)).orderBy(desc(productBundles.createdAt))));
router.get('/admin', authenticateToken, authorizeRoles('admin', 'sub-admin'), async (_req, res) => res.json(await db.select().from(productBundles).orderBy(desc(productBundles.createdAt))));
router.post('/', authenticateToken, authorizeRoles('admin', 'sub-admin'), async (req, res) => {
    const { name, description, image, price, items, isActive } = req.body || {};
    if (!name?.trim() || !Number.isFinite(Number(price)) || Number(price) < 0 || !Array.isArray(items)) return res.status(400).json({ error: 'Name, price, and bundle items are required.' });
    const [bundle] = await db.insert(productBundles).values({ name: name.trim().slice(0, 160), description: typeof description === 'string' ? description.slice(0, 1200) : null, image: typeof image === 'string' ? image.slice(0, 1000) : null, price: String(Number(price)), items, isActive: isActive !== false }).returning();
    res.status(201).json(bundle);
});
router.patch('/:id', authenticateToken, authorizeRoles('admin', 'sub-admin'), async (req, res) => {
    const { name, description, image, price, items, isActive } = req.body || {};
    if (price !== undefined && (!Number.isFinite(Number(price)) || Number(price) < 0)) {
        return res.status(400).json({ error: 'Bundle price must be a valid non-negative amount.' });
    }
    const [bundle] = await db.update(productBundles).set({ ...(name ? { name: String(name).slice(0, 160) } : {}), ...(description !== undefined ? { description: String(description).slice(0, 1200) } : {}), ...(image !== undefined ? { image: String(image).slice(0, 1000) } : {}), ...(price !== undefined ? { price: String(Number(price)) } : {}), ...(Array.isArray(items) ? { items } : {}), ...(typeof isActive === 'boolean' ? { isActive } : {}) }).where(eq(productBundles.id, req.params.id)).returning();
    if (!bundle) return res.status(404).json({ error: 'Bundle not found.' });
    res.json(bundle);
});
module.exports = router;

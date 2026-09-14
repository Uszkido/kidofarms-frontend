const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { coupons } = require('../db/schema');
const { eq, gte, lte, and } = require('drizzle-orm');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.use(authorizeRoles('admin', 'sub-admin'));

// Get all coupons
router.get('/', async (req, res) => {
    try {
        const allCoupons = await db.select().from(coupons);
        res.json(allCoupons);
    } catch (error) {
        console.error('Coupons Error:', error);
        res.status(500).json({ error: 'Failed to fetch coupons' });
    }
});

// Create new coupon
router.post('/', async (req, res) => {
    const { code, discountType, discountValue, minOrderAmount, expiresAt, usageLimit, isActive, isFlashSale, endsAt } = req.body;
    const normalizedCode = typeof code === 'string' ? code.trim().toUpperCase() : '';
    const normalizedValue = Number(discountValue);
    if (!/^[A-Z0-9-]{3,40}$/.test(normalizedCode)) return res.status(400).json({ error: 'Use 3–40 letters, numbers, or dashes for the promo code.' });
    if (!['percentage', 'fixed'].includes(discountType || 'percentage') || !Number.isFinite(normalizedValue) || normalizedValue <= 0) {
        return res.status(400).json({ error: 'Enter a valid discount.' });
    }
    if ((discountType || 'percentage') === 'percentage' && normalizedValue > 100) return res.status(400).json({ error: 'Percentage discounts cannot exceed 100%.' });

    try {
        const [newCoupon] = await db.insert(coupons).values({
            code: normalizedCode,
            discountType: discountType || 'percentage',
            discountValue: normalizedValue,
            minOrderAmount: Number(minOrderAmount) || 0,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            usageLimit: Number(usageLimit) || 0,
            isActive: isActive !== undefined ? isActive : true,
            isFlashSale: isFlashSale || false,
            endsAt: endsAt ? new Date(endsAt) : null
        }).returning();

        res.status(201).json(newCoupon);
    } catch (error) {
        console.error('Coupon Creation Error:', error);
        res.status(500).json({ error: 'Failed to create coupon' });
    }
});

// Deactivate coupon
router.patch('/:id/deactivate', async (req, res) => {
    const { id } = req.params;

    try {
        await db.update(coupons)
            .set({ isActive: false })
            .where(eq(coupons.id, id));

        res.json({ message: 'Coupon deactivated successfully' });
    } catch (error) {
        console.error('Coupon Deactivation Error:', error);
        res.status(500).json({ error: 'Failed to deactivate coupon' });
    }
});

module.exports = router;

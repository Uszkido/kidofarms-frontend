const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { coupons } = require('../db/schema');
const { eq, gte, lte, and } = require('drizzle-orm');

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

    try {
        const [newCoupon] = await db.insert(coupons).values({
            code,
            discountType: discountType || 'percentage',
            discountValue: Number(discountValue),
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

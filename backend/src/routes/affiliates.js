const express = require('express');
const router = express.Router();
const db = require('../db');
const { affiliates, commissions, users, orders } = require('../db/schema');
const { eq, and, desc } = require('drizzle-orm');

// Apply to be an affiliate
router.post('/apply', async (req, res) => {
    try {
        const { userId } = req.body;

        // Check if already an affiliate
        const existing = await db.select().from(affiliates).where(eq(affiliates.userId, userId)).limit(1);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User is already an affiliate' });
        }

        // Generate referral code (KIDO + first 4 of UUID)
        const referralCode = `KIDO-${userId.substring(0, 4).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

        await db.insert(affiliates).values({
            userId,
            referralCode,
            status: 'active', // Auto-approve for now
            commissionRate: "5.00"
        });

        // Update user role
        await db.update(users).set({ role: 'affiliate' }).where(eq(users.id, userId));

        res.status(201).json({ message: 'Affiliate application successful', referralCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get affiliate dashboard stats
router.get('/dashboard/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const affiliate = await db.select().from(affiliates).where(eq(affiliates.userId, userId)).limit(1);
        if (affiliate.length === 0) {
            return res.status(404).json({ message: 'Affiliate not found' });
        }

        const affId = affiliate[0].id;

        // Get commissions
        const affCommissions = await db.select().from(commissions)
            .where(eq(commissions.affiliateId, affId))
            .orderBy(desc(commissions.createdAt));

        // Get total earnings
        const totalEarnings = affCommissions.reduce((sum, c) => sum + parseFloat(c.amount), 0);
        const pendingEarnings = affCommissions.filter(c => c.status === 'pending')
            .reduce((sum, c) => sum + parseFloat(c.amount), 0);

        res.json({
            referralCode: affiliate[0].referralCode,
            commissionRate: affiliate[0].commissionRate,
            totalEarnings: totalEarnings.toFixed(2),
            pendingEarnings: pendingEarnings.toFixed(2),
            commissions: affCommissions
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

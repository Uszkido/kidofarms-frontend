const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { users, orders, wallets, walletTransactions, activityLogs } = require('../db/schema');
const { eq, sql, desc } = require('drizzle-orm');

// 1. POST /api/admin/ai/scan-trust - Master Trust Oracle Logic
router.post('/scan-trust', async (req, res) => {
    try {
        const allWallets = await db.select().from(wallets);
        const results = [];

        for (const wallet of allWallets) {
            let score = 50; // Baseline
            const userId = wallet.userId;

            // A. Analysis: Order History
            const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
            const successfulOrders = userOrders.filter(o => o.orderStatus === 'delivered').length;
            const cancelledOrders = userOrders.filter(o => o.orderStatus === 'cancelled').length;

            score += (successfulOrders * 5); // +5 for every successful delivery
            score -= (cancelledOrders * 10); // -10 for every cancellation

            // B. Analysis: Wallet Activity
            const transactions = await db.select().from(walletTransactions).where(eq(walletTransactions.walletId, wallet.id));
            const totalCredits = transactions.filter(t => t.type === 'credit').length;

            score += (totalCredits * 2); // Frequency of topping up reflects liquidity

            // C. Analysis: Tenure
            const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
            const monthsInSystem = Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 30));
            score += (monthsInSystem * 2);

            // Cap score 0-100
            score = Math.max(10, Math.min(100, score));

            // D. Suggested Credit Limit Logic
            // Based on score and total order volume
            const totalSpent = userOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
            let suggestedLimit = (totalSpent * (score / 100)) * 0.2; // 20% of normalized spend

            // Apply Update
            await db.update(wallets)
                .set({
                    trustScore: score,
                    creditLimit: sql`${suggestedLimit.toFixed(2)}`,
                    updatedAt: new Date()
                })
                .where(eq(wallets.id, wallet.id));

            results.push({ userId, score, suggestedLimit });
        }

        await db.insert(activityLogs).values({
            action: 'AI_TRUST_ORACLE_SCAN',
            entity: 'system',
            details: { walletsScanned: results.length },
        });

        res.json({ message: 'Global Trust Ledger Synced', results });
    } catch (error) {
        console.error('AI Scan Error:', error);
        res.status(500).json({ error: 'Trust Oracle failed to simulate.' });
    }
});

// 2. GET /api/admin/ai/insights/:userId - Get specific AI insights for a user
router.get('/insights/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const wallet = await db.query.wallets.findFirst({ where: eq(wallets.userId, userId) });
        if (!wallet) return res.status(404).json({ error: 'No wallet node found' });

        // Build a mock narrative for the AI's "thought process"
        const insights = {
            trustScore: wallet.trustScore,
            creditLimit: wallet.creditLimit,
            narrative: "",
            status: wallet.trustScore > 70 ? 'elite' : wallet.trustScore > 40 ? 'stable' : 'high_risk'
        };

        if (wallet.trustScore > 80) {
            insights.narrative = "This citizen demonstrates peak liquidity and operational consistency. Recommended for high-tier B2B float.";
        } else if (wallet.trustScore > 50) {
            insights.narrative = "Stable network participant. Trust index is growing. Maintain current credit ceiling.";
        } else {
            insights.narrative = "High volatility detected in transaction nodes. Manual oversight recommended for any further credit injections.";
        }

        res.json(insights);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve AI data' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { wallets, walletTransactions } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

// GET /api/wallet (Get user balance and transactions)
router.get('/', async (req, res) => {
    const userId = req.user.id;
    try {
        let [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));

        // Auto-create wallet if it doesn't exist
        if (!wallet) {
            [wallet] = await db.insert(wallets).values({ userId }).returning();
        }

        const transactions = await db.select()
            .from(walletTransactions)
            .where(eq(walletTransactions.walletId, wallet.id))
            .orderBy(desc(walletTransactions.createdAt))
            .limit(10);

        res.json({ wallet, transactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Wallet fetch failed' });
    }
});

// Balances must only change through a verified payment, commission, or an
// authorised finance workflow. Never let a customer credit their own wallet.
router.post('/credit', (_req, res) => {
    res.status(410).json({ error: 'Direct wallet credit is unavailable.' });
});

// POST /api/wallet/cashout (Withdrawal)
router.post('/cashout', async (req, res) => {
    // Do not debit a customer before an actual payout provider has accepted the
    // transfer. A request queue and provider webhook are required for that flow.
    res.status(503).json({
        error: 'Withdrawals are not available yet. Please contact support for a manual settlement.'
    });
});

module.exports = router;

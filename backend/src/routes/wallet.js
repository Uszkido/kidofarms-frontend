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
    const userId = req.user.id;
    const { amount, bankDetails } = req.body;
    try {
        const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
        if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

        if (Number(wallet.balance) < Number(amount)) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        const newBalance = (Number(wallet.balance) - Number(amount)).toString();

        await db.update(wallets)
            .set({ balance: newBalance, updatedAt: new Date() })
            .where(eq(wallets.id, wallet.id));

        const [tx] = await db.insert(walletTransactions).values({
            walletId: wallet.id,
            type: 'debit',
            amount: amount.toString(),
            description: `Cashout to ${bankDetails?.bankName || 'Bank Account'}`
        }).returning();

        res.json({ message: 'Cashout successful', tx, newBalance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Cashout failed' });
    }
});

module.exports = router;

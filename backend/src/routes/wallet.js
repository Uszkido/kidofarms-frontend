const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { wallets, walletTransactions } = require('../db/schema');
const { eq, desc } = require('drizzle-orm');

// GET /api/wallet (Get user balance and transactions)
router.get('/', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

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

// POST /api/wallet/credit (Simulate adding funds or referral reward)
router.post('/credit', async (req, res) => {
    const { userId, amount, description } = req.body;
    try {
        const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
        if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

        const newBalance = (Number(wallet.balance) + Number(amount)).toString();

        await db.update(wallets)
            .set({ balance: newBalance, updatedAt: new Date() })
            .where(eq(wallets.id, wallet.id));

        const [tx] = await db.insert(walletTransactions).values({
            walletId: wallet.id,
            type: 'credit',
            amount: amount.toString(),
            description: description || 'Account Credit'
        }).returning();

        res.json({ message: 'Credited', tx, newBalance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Credit failed' });
    }
});

// POST /api/wallet/cashout (Withdrawal)
router.post('/cashout', async (req, res) => {
    const { userId, amount, bankDetails } = req.body;
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

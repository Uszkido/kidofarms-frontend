const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const { db } = require('./src/db');
const { wallets, walletTransactions, users } = require('./src/db/schema');
const { eq } = require('drizzle-orm');

async function rewardUsers() {
    console.log("💰 Giving Welcome Rewards to all users...");
    try {
        const allUsers = await db.select().from(users);

        for (const user of allUsers) {
            let [wallet] = await db.select().from(wallets).where(eq(wallets.userId, user.id));

            if (!wallet) {
                [wallet] = await db.insert(wallets).values({ userId: user.id }).returning();
            }

            const rewardAmount = "1500.00"; // ₦1,500 welcome bonus
            const newBalance = (Number(wallet.balance) + Number(rewardAmount)).toString();

            await db.update(wallets)
                .set({ balance: newBalance, updatedAt: new Date() })
                .where(eq(wallets.id, wallet.id));

            await db.insert(walletTransactions).values({
                walletId: wallet.id,
                type: 'credit',
                amount: rewardAmount,
                description: 'Kido 2.0 Welcome Bonus! 🌾'
            });

            console.log(`✅ Credited ${user.name} with ₦${rewardAmount}`);
        }
    } catch (err) {
        console.error("❌ Reward failed:", err);
    }
    process.exit(0);
}

rewardUsers();

const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { users, orders, otps, activityLogs, products, harvests, walletTransactions, settings } = require('../db/schema');
const { desc, eq, sql, or } = require('drizzle-orm');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'kido-farms-super-secret-12345';

// 1. GET /api/admin/stats - Super Admin Dashboard Statistics
router.get('/stats', async (req, res) => {
    try {
        const [userCount] = await db.select({ count: sql`count(*)` }).from(users);
        const [orderCount] = await db.select({ count: sql`count(*)` }).from(orders);
        const [totalRevenue] = await db.select({ sum: sql`sum(total_amount)` }).from(orders);
        const [pendingOrders] = await db.select({ count: sql`count(*)` }).from(orders).where(eq(orders.orderStatus, 'processing'));

        const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);

        // Mocking some network-specific health data
        res.json({
            users: userCount.count,
            orders: orderCount.count,
            revenue: totalRevenue.sum || 0,
            pending: pendingOrders.count,
            recentOrders,
            activeNodes: 1204, // Mock
            trustIndex: '98.2%', // Mock
            lastMonthGrowth: '+14%' // Mock
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch admin statistics' });
    }
});

// 2. GET /api/admin/otps - View all active OTPs (OTP Recall)
router.get('/otps', async (req, res) => {
    try {
        const data = await db.select().from(otps).orderBy(desc(otps.createdAt));
        res.json(data);
    } catch (error) {
        console.error('OTP Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch OTPs' });
    }
});

// 3. POST /api/admin/users/create - Direct registration of new users by Admin
router.post('/users/create', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role,
            isVerified: true,
            permissions: req.body.permissions || []
        }).returning();

        await db.insert(activityLogs).values({
            action: 'ADMIN_USER_CREATE',
            entity: 'users',
            details: { email, role, permissions: req.body.permissions },
            userId: newUser.id
        });

        res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, email: newUser.email } });
    } catch (error) {
        console.error('Admin User Create Error:', error);
        res.status(400).json({ error: error.message || 'Failed to create user' });
    }
});

// 4. POST /api/admin/orders/approve-payment - Approve a manual payment
router.post('/orders/approve-payment', async (req, res) => {
    const { orderId } = req.body;
    try {
        const [order] = await db.update(orders)
            .set({ orderStatus: 'confirmed', paymentStatus: 'paid' })
            .where(eq(orders.id, orderId))
            .returning();

        await db.insert(activityLogs).values({
            action: 'PAYMENT_APPROVE',
            entity: 'orders',
            details: { orderId },
        });

        res.json({ message: 'Payment approved and order confirmed', order });
    } catch (error) {
        console.error('Payment Approve Error:', error);
        res.status(400).json({ error: 'Failed to approve payment' });
    }
});

// 5. POST /api/admin/impersonate - Ghost Protocol (Impersonation)
router.post('/impersonate', async (req, res) => {
    const { userId } = req.body;
    try {
        // Find user by ID or Email
        const user = await db.query.users.findFirst({
            where: or(eq(users.id, userId), eq(users.email, userId))
        });

        if (!user) return res.status(404).json({ error: 'Citizen not found in network' });

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name, email: user.email, impersonated: true },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        await db.insert(activityLogs).values({
            action: 'ADMIN_IMPERSONATION_START',
            entity: 'users',
            details: { targetId: user.id, targetEmail: user.email },
        });

        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        console.error('Impersonation Error:', error);
        res.status(500).json({ error: 'Protocol failed' });
    }
});

// 6. POST /api/admin/finance/credit - Credit Injection
router.post('/finance/credit', async (req, res) => {
    let { userId, amount, reason } = req.body;
    try {
        // Resolve email to userId if needed
        if (userId.includes('@')) {
            const user = await db.query.users.findFirst({ where: eq(users.email, userId) });
            if (!user) return res.status(404).json({ error: 'Citizen email not found.' });
            userId = user.id;
        }

        // 1. Ensure Wallet Exists
        let wallet = await db.query.wallets.findFirst({ where: eq(wallets.userId, userId) });
        if (!wallet) {
            [wallet] = await db.insert(wallets).values({ userId, balance: '0' }).returning();
        }

        // 2. Atomic Balance Update
        await db.update(wallets)
            .set({
                balance: sql`balance + ${Number(amount)}`,
                updatedAt: new Date()
            })
            .where(eq(wallets.userId, userId));

        // 3. Record Transaction
        const [transaction] = await db.insert(walletTransactions).values({
            walletId: wallet.id,
            type: 'credit',
            amount: sql`${Number(amount)}`,
            description: reason || 'Admin Infrastructure Credit'
        }).returning();

        await db.insert(activityLogs).values({
            action: 'ADMIN_CREDIT_INJECTION',
            entity: 'wallet',
            details: { userId, amount, reason, walletId: wallet.id },
        });

        res.json({ message: 'Credit injected successfully', transaction });
    } catch (error) {
        console.error('Credit Error:', error);
        res.status(500).json({ error: 'Credit injection failed' });
    }
});

// 7. PATCH /api/admin/users/:id - Universal User Control (God Mode)
router.patch('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { farmerData, vendorData, ...userData } = req.body;
    try {
        const updateData = { ...userData };

        // Handle password hashing if provided
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        // Remove ID from body to prevent Drizzle error
        delete updateData.id;

        // 1. Update User Table
        const [updatedUser] = await db.update(users)
            .set(updateData)
            .where(eq(users.id, id))
            .returning();

        // 2. Update Associated Farmer Data if provided
        if (farmerData) {
            await db.update(farmers)
                .set(farmerData)
                .where(eq(farmers.userId, id))
                .execute();
        }

        // 3. Update Associated Vendor Data if provided
        if (vendorData) {
            await db.update(vendors)
                .set(vendorData)
                .where(eq(vendors.userId, id))
                .execute();
        }

        await db.insert(activityLogs).values({
            action: 'ADMIN_GOD_MODE_UPDATE',
            entity: 'users',
            details: { userId: id, updatedFields: Object.keys(userData), hasFarmerData: !!farmerData, hasVendorData: !!vendorData },
        });

        res.json({ message: 'Citizen record modified by Supreme Admin', user: updatedUser });
    } catch (error) {
        console.error('God Mode Update Error:', error);
        res.status(400).json({ error: 'Failed to modify citizen record: ' + error.message });
    }
});

// 9. GET /api/admin/settings - Retrieve global site config
router.get('/settings', async (req, res) => {
    try {
        const [siteSettings] = await db.select().from(settings).limit(1);
        res.json(siteSettings || {});
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch node configuration' });
    }
});

// 10. PATCH /api/admin/settings - Global Aesthetic & Theme Override
router.patch('/settings', async (req, res) => {
    try {
        const [updated] = await db.update(settings)
            .set({ ...req.body, updatedAt: new Date() })
            .returning();

        await db.insert(activityLogs).values({
            action: 'GLOBAL_THEME_RECONFIG',
            entity: 'settings',
            details: req.body,
        });

        res.json({ message: 'Global aesthetic nodes reconfigured.', settings: updated });
    } catch (error) {
        console.error('Settings Update Error:', error);
        res.status(400).json({ error: 'Failed to sync global nodes' });
    }
});

// 11. GET /api/admin/full-audit - Integrated view of everything
router.get('/full-audit', async (req, res) => {
    try {
        const recentUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(10);
        const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(10);
        const recentLogs = await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(20);

        res.json({
            users: recentUsers,
            orders: recentOrders,
            logs: recentLogs
        });
    } catch (error) {
        res.status(500).json({ error: 'Audit failed' });
    }
});

module.exports = router;

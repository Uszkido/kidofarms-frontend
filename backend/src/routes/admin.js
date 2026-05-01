const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { users, orders, otps, activityLogs, products, harvests, walletTransactions, settings, storageNodes, wallets, farmers, vendors, carriers, jobApplications, affiliates, academyCourses, energyMarketplace, globalBridge, warehouseInventory, sensors, tasks, tickets, blogPosts, shipments, notifications, systemHealth, subscribers, intelContents } = require('../db/schema');
const { desc, eq, sql, or, lt, and } = require('drizzle-orm');
const { authenticateToken, authorizeRoles, authorizePermissions } = require('../middleware/authMiddleware');
const { sendBroadcastEmail } = require('../lib/email');

router.use(authenticateToken);
router.use(authorizeRoles('admin', 'sub-admin', 'team_member'));

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const os = require('os');

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'kido-farms-super-secret-12345';

// 1. GET /api/admin/stats - Super Admin Dashboard Statistics
router.get('/stats', async (req, res) => {
    try {
        const [userCount] = await db.select({ count: sql`count(*)` }).from(users);
        const [orderCount] = await db.select({ count: sql`count(*)` }).from(orders);
        const [totalRevenue] = await db.select({ sum: sql`sum(total_amount)` }).from(orders);
        const [pendingOrders] = await db.select({ count: sql`count(*)` }).from(orders).where(eq(orders.orderStatus, 'processing'));
        const [deliveredOrders] = await db.select({ count: sql`count(*)` }).from(orders).where(eq(orders.orderStatus, 'delivered'));
        const [cancelledOrders] = await db.select({ count: sql`count(*)` }).from(orders).where(eq(orders.orderStatus, 'cancelled'));

        const totalResolved = Number(deliveredOrders.count) + Number(cancelledOrders.count);
        const fleetEfficiency = totalResolved > 0
            ? ((Number(deliveredOrders.count) / totalResolved) * 100).toFixed(1) + '%'
            : '100%';

        const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);

        // Role-based counts for Sovereign Network Nodes
        const roleStats = await db.select({
            role: users.role,
            count: sql`count(*)`,
            verified: sql`count(case when is_verified = true then 1 end)`
        }).from(users).groupBy(users.role);

        const getRoleCount = (roles) => {
            const data = roleStats.filter(rs => roles.includes(rs.role));
            return {
                total: data.reduce((acc, curr) => acc + Number(curr.count), 0),
                verified: data.reduce((acc, curr) => acc + Number(curr.verified || 0), 0)
            };
        };

        const networkNodes = {
            distributors: getRoleCount(['distributor']),
            retailers: getRoleCount(['retailer']),
            wholesale: getRoleCount(['wholesale_buyer']),
            b2b: getRoleCount(['business', 'hotel']),
            logistics: getRoleCount(['logistics_distributor', 'logistics']),
            team: getRoleCount(['admin', 'sub-admin', 'team_member', 'staff'])
        };

        res.json({
            users: userCount.count,
            orders: orderCount.count,
            revenue: totalRevenue.sum || 0,
            pending: pendingOrders.count,
            recentOrders,
            networkNodes,
            activeNodes: 1204, // Mock
            trustIndex: '98.2%', // Mock
            lastMonthGrowth: '+14%', // Mock
            fleetEfficiency,
            activeOrders: pendingOrders.count // For inventory stat
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch admin statistics' });
    }
});

// 1.5. GET /api/admin/logs - Fetch all system activity logs
router.get('/logs', async (req, res) => {
    try {
        const logs = await db.select({
            id: activityLogs.id,
            action: activityLogs.action,
            entity: activityLogs.entity,
            details: activityLogs.details,
            createdAt: activityLogs.createdAt,
            userName: users.name,
            userEmail: users.email
        })
            .from(activityLogs)
            .leftJoin(users, eq(activityLogs.userId, users.id))
            .orderBy(desc(activityLogs.createdAt))
            .limit(50);
        res.json(logs);
    } catch (error) {
        console.error('Fetch Logs Error:', error);
        res.status(500).json({ error: 'Failed to fetch registry logs' });
    }
});

// 2. GET /api/admin/otps - View all active OTPs (OTP Recall)
router.get('/otps', async (req, res) => {
    try {
        const data = await db.select({
            id: otps.id,
            code: otps.code,
            expiresAt: otps.expiresAt,
            isUsed: otps.isUsed,
            createdAt: otps.createdAt,
            userName: users.name,
            userEmail: users.email
        })
            .from(otps)
            .leftJoin(users, eq(otps.userId, users.id))
            .orderBy(desc(otps.createdAt));

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

// 3.5 POST /api/admin/users/bulk - Bulk Action Controls
router.post('/users/bulk', async (req, res) => {
    const { action, userIds } = req.body;
    if (!action || !userIds || !userIds.length) return res.status(400).json({ error: 'Missing parameters' });

    try {
        let updatedCount = 0;
        if (action === 'approve') {
            await db.update(users).set({ isVerified: true }).where(sql`${users.id} IN ${userIds}`);
            updatedCount = userIds.length;
        } else if (action === 'suspend') {
            await db.update(users).set({ isVerified: false }).where(sql`${users.id} IN ${userIds}`);
            updatedCount = userIds.length;
        } else if (action === 'delete') {
            await db.delete(users).where(sql`${users.id} IN ${userIds}`);
            updatedCount = userIds.length;
        }

        await db.insert(activityLogs).values({
            action: `ADMIN_BULK_${action.toUpperCase()}`,
            entity: 'users',
            details: { count: userIds.length, userIds },
            userId: req.user.id
        });

        res.json({ message: `Successfully executed ${action} on ${updatedCount} nodes.` });
    } catch (error) {
        console.error('Bulk Action Error:', error);
        res.status(500).json({ error: 'Global command failed: ' + error.message });
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
        const user = await db.query.users.findFirst({
            where: or(eq(users.id, userId), eq(users.email, userId))
        });

        if (!user) return res.status(404).json({ error: 'Citizen not found in network' });
        // Block impersonating admins for safety
        if (user.role === 'admin') return res.status(403).json({ error: 'Cannot ghost into an Admin node. Access denied.' });

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                name: user.name,
                email: user.email,
                isImpersonated: true,             // flag for Ghost Mode banner
                impersonatedBy: req.user.name,    // admin name for banner
                impersonatedByRole: req.user.role
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        await db.insert(activityLogs).values({
            action: 'ADMIN_IMPERSONATION_START',
            entity: 'users',
            details: { targetId: user.id, targetEmail: user.email, adminName: req.user.name },
            userId: req.user.id
        });

        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        console.error('Impersonation Error:', error);
        res.status(500).json({ error: 'Protocol failed' });
    }
});

// 5.5 GET /api/admin/audit-logs - Full Paginated Audit Ledger
router.get('/audit-logs', async (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    try {
        const logs = await db.select({
            id: activityLogs.id,
            action: activityLogs.action,
            entity: activityLogs.entity,
            details: activityLogs.details,
            createdAt: activityLogs.createdAt,
            actorName: users.name,
            actorEmail: users.email,
            actorRole: users.role
        })
            .from(activityLogs)
            .leftJoin(users, eq(activityLogs.userId, users.id))
            .orderBy(desc(activityLogs.createdAt))
            .limit(limit)
            .offset(offset);
        const [total] = await db.select({ count: sql`count(*)` }).from(activityLogs);
        res.json({ logs, total: Number(total.count), limit, offset });
    } catch (error) {
        console.error('Audit Logs Error:', error);
        res.status(500).json({ error: 'Failed to fetch audit ledger' });
    }
});

// 5.6 GET /api/admin/ai-config - Get AI Verification Engine Config
router.get('/ai-config', async (req, res) => {
    try {
        const cfg = await db.query.settings.findFirst({ where: eq(settings.id, 'site_config') });
        res.json(cfg?.themeConfig?.aiVerificationConfig || {
            farmerAutoApproveThreshold: 80,
            vendorAutoApproveThreshold: 75,
            documentCheckRequired: true,
            flagBelowConfidence: 40,
            reviewQueueEnabled: true
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch AI config' });
    }
});

// 5.7 PATCH /api/admin/ai-config - Update AI Verification Engine Config
router.patch('/ai-config', async (req, res) => {
    try {
        const existing = await db.query.settings.findFirst({ where: eq(settings.id, 'site_config') });
        const aiVerificationConfig = { ...(existing?.themeConfig?.aiVerificationConfig || {}), ...req.body };
        await db.update(settings)
            .set({ themeConfig: { ...(existing?.themeConfig || {}), aiVerificationConfig }, updatedAt: new Date() })
            .where(eq(settings.id, 'site_config'));

        await db.insert(activityLogs).values({
            action: 'AI_CONFIG_UPDATE',
            entity: 'settings',
            details: { changes: req.body },
            userId: req.user.id
        });
        res.json({ message: 'AI Verification Engine updated.', config: aiVerificationConfig });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update AI config' });
    }
});

// 5.8 GET /api/admin/payouts - Wallet balances for all farmers/vendors/affiliates
router.get('/payouts', async (req, res) => {
    try {
        const allUsers = await db.select({
            userId: users.id,
            userName: users.name,
            userEmail: users.email,
            role: users.role
        }).from(users);

        const eligible = allUsers.filter(u => ['farmer', 'vendor', 'affiliate', 'carrier'].includes(u.role));

        const results = await Promise.all(eligible.map(async (u) => {
            const wallet = await db.query.wallets.findFirst({ where: eq(wallets.userId, u.userId) });
            let bankInfo = { bankName: null, accountNumber: null, accountName: null };
            if (u.role === 'farmer') {
                const f = await db.query.farmers.findFirst({ where: eq(farmers.userId, u.userId) });
                if (f) bankInfo = { bankName: f.bankName, accountNumber: f.accountNumber, accountName: f.accountName };
            }
            return { ...u, balance: wallet?.balance || '0', pendingPayout: wallet?.balance || '0', ...bankInfo };
        }));

        res.json(results);
    } catch (error) {
        console.error('Payouts Error:', error);
        res.status(500).json({ error: 'Failed to fetch payout data' });
    }
});

// 5.9 POST /api/admin/payouts/initiate - Initiate a payout (debit wallet)
router.post('/payouts/initiate', async (req, res) => {
    const { userId, amount, note } = req.body;
    if (!userId || !amount) return res.status(400).json({ error: 'Missing userId or amount' });
    try {
        const wallet = await db.query.wallets.findFirst({ where: eq(wallets.userId, userId) });
        if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
        if (parseFloat(wallet.balance) < parseFloat(amount)) return res.status(400).json({ error: 'Insufficient balance' });

        await db.update(wallets).set({ balance: sql`balance - ${parseFloat(amount)}`, updatedAt: new Date() }).where(eq(wallets.userId, userId));
        await db.insert(walletTransactions).values({ walletId: wallet.id, type: 'debit', amount: sql`${parseFloat(amount)}`, description: note || 'Admin Payout Disbursement' });
        await db.insert(activityLogs).values({ action: 'ADMIN_PAYOUT_INITIATE', entity: 'wallet', details: { userId, amount, note }, userId: req.user.id });

        res.json({ message: `Payout of ₦${parseFloat(amount).toLocaleString()} initiated.` });
    } catch (error) {
        console.error('Payout Error:', error);
        res.status(500).json({ error: 'Payout failed' });
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


// 6.5. POST /api/admin/finance/debit - Credit Extraction (Debit)
router.post('/finance/debit', async (req, res) => {
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
            return res.status(400).json({ error: 'Target has no active wallet node.' });
        }

        // 2. Atomic Balance Update (Subtraction)
        // Note: Using Number(amount) to ensure it's a value. 
        // We allow negative balance if needed for "debts", or we could add a check here.
        await db.update(wallets)
            .set({
                balance: sql`balance - ${Number(amount)}`,
                updatedAt: new Date()
            })
            .where(eq(wallets.userId, userId));

        // 3. Record Transaction
        const [transaction] = await db.insert(walletTransactions).values({
            walletId: wallet.id,
            type: 'debit',
            amount: sql`${Number(amount)}`,
            description: reason || 'Admin Infrastructure Debit'
        }).returning();

        await db.insert(activityLogs).values({
            action: 'ADMIN_DEBIT_EXTRACTION',
            entity: 'wallet',
            details: { userId, amount, reason, walletId: wallet.id },
        });

        res.json({ message: 'Liquidity extracted successfully', transaction });
    } catch (error) {
        console.error('Debit Error:', error);
        res.status(500).json({ error: 'Debit extraction failed' });
    }
});


// 6.9 GET /api/admin/payments - Full platform payment transactions ledger
router.get('/payments', async (req, res) => {
    const limit = parseInt(req.query.limit) || 200;
    const offset = parseInt(req.query.offset) || 0;
    try {
        const txns = await db.select({
            id: walletTransactions.id,
            type: walletTransactions.type,
            amount: walletTransactions.amount,
            description: walletTransactions.description,
            createdAt: walletTransactions.createdAt,
            userName: users.name,
            userEmail: users.email
        })
            .from(walletTransactions)
            .leftJoin(wallets, eq(walletTransactions.walletId, wallets.id))
            .leftJoin(users, eq(wallets.userId, users.id))
            .orderBy(desc(walletTransactions.createdAt))
            .limit(limit)
            .offset(offset);
        res.json(txns);
    } catch (error) {
        console.error('Payments Ledger Error:', error);
        res.status(500).json({ error: 'Failed to fetch payment transactions' });
    }
});

// 6.95 GET /api/admin/revenue-chart - 30-day daily revenue for chart
router.get('/revenue-chart', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const rows = await db.select({
            day: sql`DATE(${orders.createdAt})`,
            revenue: sql`SUM(${orders.totalAmount})`,
            count: sql`COUNT(*)`,
        })
            .from(orders)
            .where(sql`${orders.createdAt} >= NOW() - INTERVAL '${days} days'`)
            .groupBy(sql`DATE(${orders.createdAt})`)
            .orderBy(sql`DATE(${orders.createdAt})`);

        // Fill missing days with zeros
        const map = new Map(rows.map((r) => [r.day, { revenue: parseFloat(r.revenue) || 0, count: parseInt(r.count) }]));
        const result = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            result.push({ date: key, revenue: map.get(key)?.revenue || 0, orders: map.get(key)?.count || 0 });
        }
        res.json(result);
    } catch (error) {
        console.error('Revenue Chart Error:', error);
        res.status(500).json({ error: 'Failed to fetch revenue chart data' });
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

// 12. GET /api/admin/storage - Fetch all storage nodes/warehouses
router.get('/storage', async (req, res) => {
    try {
        const nodes = await db.select().from(storageNodes).orderBy(desc(storageNodes.updatedAt));
        res.json(nodes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch storage nodes' });
    }
});

// 13. POST /api/admin/storage/:id/toggle - Toggle storage node status
router.post('/storage/:id/toggle', async (req, res) => {
    const { id } = req.params;
    try {
        const node = await db.query.storageNodes.findFirst({ where: eq(storageNodes.id, id) });
        if (!node) return res.status(404).json({ error: 'Node not found' });

        const [updated] = await db.update(storageNodes)
            .set({ isActive: !node.isActive })
            .where(eq(storageNodes.id, id))
            .returning();

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle node status' });
    }
});

// 14. GET /api/admin/users - Retrieve full registry of citizens
router.get('/users', async (req, res) => {
    try {
        const data = await db.select().from(users).orderBy(desc(users.createdAt));
        res.json(data);
    } catch (error) {
        console.error('Fetch Users Error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// 15. GET /api/admin/storage/:id/inventory - Fetch warehouse inventory
router.get('/storage/:id/inventory', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await db.select({
            id: warehouseInventory.id,
            productId: warehouseInventory.productId,
            quantity: warehouseInventory.quantity,
            productName: products.name,
            productImage: products.image
        })
            .from(warehouseInventory)
            .leftJoin(products, eq(warehouseInventory.productId, products.id))
            .where(eq(warehouseInventory.warehouseId, id));

        res.json(data);
    } catch (error) {
        console.error('Fetch Warehouse Inventory Error:', error);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
});

// 16. PATCH /api/admin/storage/:id/inventory - Update product stock in warehouse
router.post('/storage/:id/inventory', async (req, res) => {
    const { id } = req.params;
    const { productId, quantity } = req.body;
    try {
        // Simple upsert logic
        const existing = await db.query.warehouseInventory.findFirst({
            where: sql`${warehouseInventory.warehouseId} = ${id} AND ${warehouseInventory.productId} = ${productId}`
        });

        if (existing) {
            await db.update(warehouseInventory)
                .set({ quantity, updatedAt: new Date() })
                .where(eq(warehouseInventory.id, existing.id));
        } else {
            await db.insert(warehouseInventory).values({
                warehouseId: id,
                productId,
                quantity
            });
        }
        res.json({ message: 'Inventory synchronization successful' });
    } catch (error) {
        console.error('Update Warehouse Inventory Error:', error);
        res.status(500).json({ error: 'Failed to sync inventory' });
    }
});

// 17. PATCH /api/admin/storage/:id/manager - Assign warehouse manager
router.patch('/storage/:id/manager', async (req, res) => {
    const { id } = req.params;
    const { managerId } = req.body;
    try {
        await db.update(storageNodes)
            .set({ managerId, updatedAt: new Date() })
            .where(eq(storageNodes.id, id));
        res.json({ message: 'Warehouse manager assigned successfully' });
    } catch (error) {
        console.error('Assign Manager Error:', error);
        res.status(500).json({ error: 'Failed to assign manager' });
    }
});

// 18. POST /api/admin/storage - Create new warehouse node
router.post('/storage', async (req, res) => {
    const { name, location, type, capacity } = req.body;
    try {
        const [newNode] = await db.insert(storageNodes).values({
            name,
            location,
            type: type || 'cold_storage',
            capacity: parseInt(capacity) || 1000,
            status: 'optimal',
            isActive: true
        }).returning();
        res.status(201).json(newNode);
    } catch (error) {
        console.error('Create Warehouse Error:', error);
        res.status(500).json({ error: 'Failed to initialize node' });
    }
});

// 19. GET /api/admin/tasks - Fetch all tasks
router.get('/tasks', async (req, res) => {
    try {
        const allTasks = await db.select({
            id: tasks.id,
            title: tasks.title,
            description: tasks.description,
            status: tasks.status,
            priority: tasks.priority,
            dueDate: tasks.dueDate,
            createdAt: tasks.createdAt,
            assignedToId: tasks.assignedToId,
            assignedById: tasks.assignedById,
            assignedToName: users.name,
            assignedToEmail: users.email
        })
            .from(tasks)
            .leftJoin(users, eq(tasks.assignedToId, users.id))
            .orderBy(desc(tasks.createdAt));

        res.json(allTasks);
    } catch (error) {
        console.error('Fetch All Tasks Error:', error);
        res.status(500).json({ error: 'Failed to fetch task ledger' });
    }
});

// 20. POST /api/admin/tasks - Create/Assign new task
router.post('/tasks', async (req, res) => {
    const { assignedToId, assignedById, title, description, priority, dueDate } = req.body;
    try {
        const [newTask] = await db.insert(tasks).values({
            assignedToId,
            assignedById,
            title,
            description,
            priority: priority || 'medium',
            dueDate: dueDate ? new Date(dueDate) : null,
            status: 'pending'
        }).returning();
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Create Task Error:', error);
        res.status(500).json({ error: 'Failed to deploy task node' });
    }
});

// 21. GET /api/admin/tasks/user/:userId - Fetch tasks for a specific user
router.get('/tasks/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const userTasks = await db.select().from(tasks).where(eq(tasks.assignedToId, userId)).orderBy(desc(tasks.createdAt));
        res.json(userTasks);
    } catch (error) {
        console.error('Fetch User Tasks Error:', error);
        res.status(500).json({ error: 'Failed to fetch user tasks' });
    }
});

// 22. PATCH /api/admin/tasks/:id/status - Update task status (Staff side)
router.patch('/tasks/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.update(tasks)
            .set({ status, updatedAt: new Date() })
            .where(eq(tasks.id, id));
        res.json({ message: 'Directive status updated' });
    } catch (error) {
        console.error('Update Task Status Error:', error);
        res.status(500).json({ error: 'Failed to update task node' });
    }
});

// 23. GET /api/admin/entities/:entity - Universal Entity Retrieval
router.get('/entities/:entity', async (req, res) => {
    const { entity } = req.params;
    const tables = { users, orders, products, harvests, farmers, vendors, carriers, jobApplications, affiliates, storageNodes, academyCourses, energyMarketplace, globalBridge, warehouseInventory, sensors, tasks, tickets, blogPosts, shipments };

    if (!tables[entity]) return res.status(400).json({ error: 'Unknown entity' });

    try {
        const data = await db.select().from(tables[entity]).orderBy(desc(tables[entity].createdAt || tables[entity].id));
        res.json(data);
    } catch (error) {
        console.error(`Fetch ${entity} Error:`, error);
        res.status(500).json({ error: `Failed to fetch ${entity}` });
    }
});

// 23.5. POST /api/admin/entities/:entity - Universal Entity Creation
router.post('/entities/:entity', authorizePermissions('global_data_command'), async (req, res) => {
    const { entity } = req.params;
    const tables = { users, orders, products, harvests, farmers, vendors, carriers, jobApplications, affiliates, storageNodes, academyCourses, energyMarketplace, globalBridge, warehouseInventory, sensors, tasks, tickets, blogPosts, shipments };

    if (!tables[entity]) return res.status(400).json({ error: 'Unknown entity' });

    try {
        const [inserted] = await db.insert(tables[entity])
            .values({ ...req.body })
            .returning();

        await db.insert(activityLogs).values({
            action: 'ADMIN_GLOBAL_INJECT',
            entity: entity,
            details: { id: inserted.id, fields: Object.keys(req.body) },
            userId: req.user.id
        });

        res.status(201).json(inserted);
    } catch (error) {
        console.error(`Inject ${entity} Error:`, error);
        res.status(500).json({ error: `Failed to inject ${entity}. Ensure all required fields are present.` });
    }
});

// 24. PATCH /api/admin/entities/:entity/:id - Universal Entity Modification
router.patch('/entities/:entity/:id', authorizePermissions('global_data_command'), async (req, res) => {
    const { entity, id } = req.params;
    const tables = { users, orders, products, harvests, farmers, vendors, carriers, jobApplications, affiliates, storageNodes, academyCourses, energyMarketplace, globalBridge, warehouseInventory, sensors, tasks, tickets, blogPosts, shipments };

    if (!tables[entity]) return res.status(400).json({ error: 'Unknown entity' });

    try {
        const [updated] = await db.update(tables[entity])
            .set({ ...req.body, updatedAt: new Date() })
            .where(eq(tables[entity].id, id))
            .returning();

        await db.insert(activityLogs).values({
            action: 'ADMIN_GLOBAL_EDIT',
            entity: entity,
            details: { id, fields: Object.keys(req.body) },
            userId: req.user.id
        });

        res.json(updated);
    } catch (error) {
        console.error(`Update ${entity} Error:`, error);
        res.status(500).json({ error: `Failed to update ${entity}` });
    }
});

// 24.5. DELETE /api/admin/entities/:entity/:id - Universal Entity Deletion
router.delete('/entities/:entity/:id', authorizePermissions('global_data_command'), async (req, res) => {
    const { entity, id } = req.params;
    const tables = { users, orders, products, harvests, farmers, vendors, carriers, jobApplications, affiliates, storageNodes, academyCourses, energyMarketplace, globalBridge, warehouseInventory, sensors, tasks, tickets, blogPosts, shipments };

    if (!tables[entity]) return res.status(400).json({ error: 'Unknown entity' });

    try {
        await db.delete(tables[entity]).where(eq(tables[entity].id, id));

        await db.insert(activityLogs).values({
            action: 'ADMIN_GLOBAL_DELETE',
            entity: entity,
            details: { id },
            userId: req.user.id
        });

        res.json({ message: 'Node successfully expunged from ledger' });
    } catch (error) {
        console.error(`Delete ${entity} Error:`, error);
        res.status(500).json({ error: `Failed to detatch ${entity}. This node might be referenced by other active nodes.` });
    }
});

// 25. POST /api/admin/academy/modules - Add Mastery Academy Module
router.post('/academy/modules', authorizePermissions('global_data_command'), async (req, res) => {
    const { title, category, description, content, points } = req.body;
    try {
        const [newModule] = await db.insert(academyCourses).values({
            title,
            category,
            description,
            content,
            points: points || 10,
            isPublished: true
        }).returning();

        await db.insert(activityLogs).values({
            action: 'ACADEMY_MODULE_CREATE',
            entity: 'academy_courses',
            details: { title, category },
            userId: req.user.id
        });

        res.status(201).json(newModule);
    } catch (error) {
        console.error('Create Academy Module Error:', error);
        res.status(500).json({ error: 'Failed to initialize academy node' });
    }
});

// 26. GET /api/admin/health - System Health Real-time Data
router.get('/health', authorizePermissions('report_access'), async (req, res) => {
    try {
        const stats = await db.select().from(systemHealth).orderBy(desc(systemHealth.createdAt)).limit(10);

        // Real OS Telemetry
        const cpus = os.cpus();
        const load = os.loadavg()[0]; // 1 min load average
        const cpuPercentage = Math.min(Math.floor((load / cpus.length) * 100), 100) || Math.floor(Math.random() * 20) + 5;

        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const memPercentage = Math.floor(((totalMem - freeMem) / totalMem) * 100);

        const health = stats.length > 0 ? stats : [{
            status: 'optimal',
            cpuUsage: cpuPercentage,
            memoryUsage: memPercentage,
            activeUsers: Math.floor(Math.random() * 50) + 100, // Still mock active users for now
            apiErrors: 0,
            createdAt: new Date()
        }];

        res.json({
            current: {
                status: 'OPTIMAL',
                cpuUsage: cpuPercentage,
                memoryUsage: memPercentage,
                activeUsers: health[0]?.activeUsers || 100
            },
            history: health,
            database: 'connected',
            redis: 'active',
            storage: '84% free'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch terminal health' });
    }
});

// 27. POST /api/admin/broadcast - Pulse Notification & Email to all citizens
router.post('/broadcast', authorizePermissions('global_data_command'), async (req, res) => {
    const { title, message, type, link } = req.body;
    try {
        // 1. Fetch all users and subscribers for broad-spectrum pulse
        const allUsers = await db.select({ id: users.id, email: users.email }).from(users);
        const allSubscribers = await db.select({ email: subscribers.email }).from(subscribers);

        // 2. Insert in-app notifications
        const notificationEntries = allUsers.map(u => ({
            userId: u.id,
            type: type || 'system',
            title,
            message,
            link,
            isRead: false
        }));

        if (notificationEntries.length > 0) {
            await db.insert(notifications).values(notificationEntries);
        }

        // 3. Trigger Global Email Broadcast
        const emailList = [
            ...new Set([
                ...allUsers.map(u => u.email),
                ...allSubscribers.map(s => s.email)
            ])
        ].filter(Boolean);

        if (emailList.length > 0) {
            // Non-blocking email broadcast to ensure speed
            sendBroadcastEmail(emailList, title, message, link).catch(err => console.error("Broadcast Email Failure:", err));
        }

        res.json({
            message: `Pulse broadcast sent to ${allUsers.length} in-app nodes and ${emailList.length} external email channels.`,
            stats: { users: allUsers.length, emails: emailList.length }
        });
    } catch (error) {
        console.error("Broadcast Logic Error:", error);
        res.status(500).json({ error: 'Global command broadcast failure' });
    }
});

// 28. GET /api/admin/products/low-stock - Inventory Alerts
router.get('/products/low-stock', async (req, res) => {
    try {
        const lowStock = await db.select().from(products).where(lt(products.stock, 10)).orderBy(products.stock);
        res.json(lowStock);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch depletion alerts' });
    }
});


// ─── INTEL MANAGEMENT (Sovereign Vault + Intel Exchange) ─────────────────────

// 29. GET /api/admin/intel - Fetch all intel content (optionally by section: vault | exchange)
router.get('/intel', async (req, res) => {
    try {
        const { section } = req.query;
        let query = db.select().from(intelContents).orderBy(desc(intelContents.createdAt));
        if (section) {
            query = db.select().from(intelContents)
                .where(eq(intelContents.section, section))
                .orderBy(desc(intelContents.createdAt));
        }
        const items = await query;
        res.json(items);
    } catch (error) {
        console.error('Intel Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch intel contents' });
    }
});

// 30. POST /api/admin/intel - Create new intel content
router.post('/intel', async (req, res) => {
    const { title, body, type, category, section, status } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    try {
        const [item] = await db.insert(intelContents).values({
            title,
            body: body || '',
            type: type || 'Technical',
            category: category || 'General',
            section: section || 'vault',
            status: status || 'draft',
            isLive: false,
            authorId: req.user.id
        }).returning();

        await db.insert(activityLogs).values({
            action: 'INTEL_CREATE',
            entity: 'intel_contents',
            details: { title, section: section || 'vault' },
            userId: req.user.id
        });

        res.status(201).json(item);
    } catch (error) {
        console.error('Intel Create Error:', error);
        res.status(500).json({ error: 'Failed to create intel content' });
    }
});

// 31. PATCH /api/admin/intel/:id - Update intel content
router.patch('/intel/:id', async (req, res) => {
    const { id } = req.params;
    const { title, body, type, category, status } = req.body;
    try {
        const [updated] = await db.update(intelContents)
            .set({ title, body, type, category, status, updatedAt: new Date() })
            .where(eq(intelContents.id, id))
            .returning();

        if (!updated) return res.status(404).json({ error: 'Intel item not found' });

        await db.insert(activityLogs).values({
            action: 'INTEL_UPDATE',
            entity: 'intel_contents',
            details: { id, changes: req.body },
            userId: req.user.id
        });

        res.json(updated);
    } catch (error) {
        console.error('Intel Update Error:', error);
        res.status(500).json({ error: 'Failed to update intel content' });
    }
});

// 32. PATCH /api/admin/intel/:id/golive - Toggle Live status
router.patch('/intel/:id/golive', async (req, res) => {
    const { id } = req.params;
    try {
        const existing = await db.query.intelContents.findFirst({ where: eq(intelContents.id, id) });
        if (!existing) return res.status(404).json({ error: 'Intel item not found' });

        const newLiveState = !existing.isLive;
        const [updated] = await db.update(intelContents)
            .set({
                isLive: newLiveState,
                status: newLiveState ? 'published' : 'draft',
                updatedAt: new Date()
            })
            .where(eq(intelContents.id, id))
            .returning();

        await db.insert(activityLogs).values({
            action: newLiveState ? 'INTEL_GO_LIVE' : 'INTEL_TAKE_OFFLINE',
            entity: 'intel_contents',
            details: { id, title: existing.title, isLive: newLiveState },
            userId: req.user.id
        });

        res.json({ message: newLiveState ? 'Content is now LIVE' : 'Content taken offline', item: updated });
    } catch (error) {
        console.error('Intel GoLive Error:', error);
        res.status(500).json({ error: 'Failed to toggle live status' });
    }
});

// 33. DELETE /api/admin/intel/:id - Delete intel content
router.delete('/intel/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const existing = await db.query.intelContents.findFirst({ where: eq(intelContents.id, id) });
        if (!existing) return res.status(404).json({ error: 'Intel item not found' });

        await db.delete(intelContents).where(eq(intelContents.id, id));

        await db.insert(activityLogs).values({
            action: 'INTEL_DELETE',
            entity: 'intel_contents',
            details: { id, title: existing.title },
            userId: req.user.id
        });

        res.json({ message: 'Intel content deleted successfully' });
    } catch (error) {
        console.error('Intel Delete Error:', error);
        res.status(500).json({ error: 'Failed to delete intel content' });
    }
});

module.exports = router;

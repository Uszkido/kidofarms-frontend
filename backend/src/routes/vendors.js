const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { vendors, users } = require('../db/schema');
const { eq, and } = require('drizzle-orm');

// Get all vendors (Farmer role)
router.get('/', async (req, res) => {
    try {
        const allVendors = await db.select({
            id: vendors.id,
            businessName: vendors.businessName,
            status: vendors.status,
            categories: vendors.categories,
            createdAt: vendors.createdAt,
            userName: users.name,
            userEmail: users.email
        })
            .from(vendors)
            .leftJoin(users, eq(vendors.userId, users.id));

        res.json(allVendors);
    } catch (error) {
        console.error('Vendors Error:', error);
        res.status(500).json({ error: 'Failed to fetch vendors' });
    }
});

// Register new vendor
router.post('/register', async (req, res) => {
    const { userId, businessName, description, categories: vendorCategories } = req.body;

    try {
        const [newVendor] = await db.insert(vendors).values({
            userId,
            businessName,
            description,
            categories: vendorCategories || [],
            status: 'pending'
        }).returning();

        // Also update user role to farmer if not already
        await db.update(users)
            .set({ role: 'farmer' })
            .where(eq(users.id, userId));

        res.status(201).json(newVendor);
    } catch (error) {
        console.error('Vendor Registration Error:', error);
        res.status(500).json({ error: 'Failed to register vendor' });
    }
});

// Approve/Suspend vendor
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // approved, suspended

    try {
        await db.update(vendors)
            .set({ status })
            .where(eq(vendors.id, id));

        res.json({ message: `Vendor status updated to ${status}` });
    } catch (error) {
        console.error('Vendor Status Update Error:', error);
        res.status(500).json({ error: 'Failed to update vendor status' });
    }
});

module.exports = router;

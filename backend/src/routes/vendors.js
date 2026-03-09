const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { vendors, users, products } = require('../db/schema');
const { eq, and, desc } = require('drizzle-orm');

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

// Register new vendor (includes user creation)
router.post('/register', async (req, res) => {
    const {
        userId,
        name,
        email,
        password,
        phone,
        street,
        city,
        state,
        zip,
        businessName,
        description,
        categories: vendorCategories
    } = req.body;

    try {
        let finalUserId = userId;

        // If no userId, create a new user
        if (!finalUserId) {
            if (!email || !password || !name) {
                return res.status(400).json({ error: 'Missing required user fields (name, email, password)' });
            }

            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash(password, 10);

            const [user] = await db.insert(users).values({
                name,
                email,
                password: hashedPassword,
                phone,
                street,
                city,
                state,
                zip,
                role: 'vendor'
            }).returning();
            finalUserId = user.id;
        } else {
            // Update existing user to vendor role and add details if provided
            await db.update(users)
                .set({
                    role: 'vendor',
                    phone: phone || undefined,
                    street: street || undefined,
                    city: city || undefined,
                    state: state || undefined,
                    zip: zip || undefined
                })
                .where(eq(users.id, finalUserId));
        }

        const [newVendor] = await db.insert(vendors).values({
            userId: finalUserId,
            businessName,
            description,
            categories: vendorCategories || [],
            status: 'pending'
        }).returning();

        res.status(201).json({ vendor: newVendor, userId: finalUserId });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Email already registered' });
        }
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

// Get individual vendor profile (Public)
router.get('/:id', async (req, res) => {
    try {
        const vendor = await db.query.vendors.findFirst({
            where: eq(vendors.id, req.params.id),
            with: {
                user: true
            }
        });

        if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

        res.json(vendor);
    } catch (error) {
        console.error('Vendor Profile Error:', error);
        res.status(500).json({ error: 'Failed to fetch vendor profile' });
    }
});

// Get products for a specific vendor
router.get('/:id/products', async (req, res) => {
    try {
        const vendor = await db.query.vendors.findFirst({
            where: eq(vendors.id, req.params.id)
        });

        if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

        const vendorProducts = await db.select().from(products)
            .where(eq(products.ownerId, vendor.userId))
            .orderBy(desc(products.createdAt));

        res.json(vendorProducts);
    } catch (error) {
        console.error('Vendor Products Error:', error);
        res.status(500).json({ error: 'Failed to fetch vendor products' });
    }
});

module.exports = router;

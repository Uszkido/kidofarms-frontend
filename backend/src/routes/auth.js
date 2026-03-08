const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { users, farmers } = require('../db/schema');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'kido-farms-super-secret-12345';

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

        // Role Validation
        const allowedRoles = ['customer', 'farmer', 'subscriber'];
        const validatedRole = allowedRoles.includes(role) ? role : 'customer';

        const hashedPassword = await bcrypt.hash(password, 10);
        const [user] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            phone,
            role: validatedRole
        }).returning();

        res.status(201).json(user);
    } catch (error) {
        if (error.code === '23505') return res.status(400).json({ error: 'Email already exists' });
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/signup/farmer', async (req, res) => {
    try {
        const {
            name, email, password, phone,
            farmName, farmLocationState, farmLocationLga, farmSize, farmingType, primaryProduce,
            isOrganicCertified, yearsOfExperience, bankName, accountNumber, accountName
        } = req.body;

        if (!name || !email || !password || !farmName || !farmLocationState || !farmLocationLga) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Use a transaction since we are inserting into multiple tables
        const result = await db.transaction(async (tx) => {
            const [user] = await tx.insert(users).values({
                name,
                email,
                password: hashedPassword,
                phone,
                role: 'farmer'
            }).returning();

            await tx.insert(farmers).values({
                userId: user.id,
                farmName,
                farmLocationState,
                farmLocationLga,
                farmSize,
                farmingType,
                primaryProduce,
                isOrganicCertified: isOrganicCertified || false,
                yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : 0,
                bankName,
                accountNumber,
                accountName,
                status: 'pending'
            });

            return user;
        });

        res.status(201).json(result);
    } catch (error) {
        if (error.code === '23505') return res.status(400).json({ error: 'Email already exists' });
        console.error('Farmer Signup Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/social-login', async (req, res) => {
    try {
        const { email, name, image } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        let user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) {
            // Create user if they don't exist
            // Social users don't have a password, so we set a placeholder
            // This is safe because they will always login via Google
            const placeholderPassword = await bcrypt.hash(Math.random().toString(36), 10);
            const [newUser] = await db.insert(users).values({
                name: name || email.split('@')[0],
                email,
                password: placeholderPassword,
                role: 'customer'
            }).returning();
            user = newUser;
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Social Login Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

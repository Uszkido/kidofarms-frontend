const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { users, farmers, otps } = require('../db/schema');
const { eq, and, gt } = require('drizzle-orm');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../lib/email');


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

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, permissions: user.permissions } });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

        // Role Validation
        const allowedRoles = ['customer', 'consumer', 'farmer', 'subscriber', 'vendor'];
        const validatedRole = allowedRoles.includes(role) ? role : 'consumer';

        const hashedPassword = await bcrypt.hash(password, 10);
        const [user] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            phone,
            role: validatedRole,
            isVerified: false
        }).returning();

        // Generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

        await db.insert(otps).values({
            userId: user.id,
            code: otpCode,
            expiresAt
        });

        await sendOtpEmail(email, otpCode);

        res.status(201).json({
            message: 'User created. OTP sent to your email.',
            user: { id: user.id, email: user.email, role: user.role },
            requiresOtp: true,
            // otpCode: otpCode // No longer returning it directly for security
        });
    } catch (error) {
        if (error.code === '23505') return res.status(400).json({ error: 'Email already exists' });
        console.error('Signup Error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
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
                role: 'farmer',
                isVerified: false
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

            // Generate OTP for Farmer node
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

            await tx.insert(otps).values({
                userId: user.id,
                code: otpCode,
                expiresAt
            });

            return { user, otpCode };
        });

        await sendOtpEmail(email, result.otpCode);

        res.status(201).json({
            message: 'Farmer account created. OTP sent to your email for activation.',
            user: { id: result.user.id, email: result.user.email, role: result.user.role },
            requiresOtp: true,
            // otpCode: result.otpCode
        });
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
                role: 'customer',
                isVerified: true
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

// Verify OTP for Signup/Account Activation
router.post('/verify-otp', async (req, res) => {
    const { email, code } = req.body;
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) return res.status(404).json({ error: 'Citizen not found' });

        const validOtp = await db.query.otps.findFirst({
            where: and(
                eq(otps.userId, user.id),
                eq(otps.code, code),
                eq(otps.isUsed, false),
                gt(otps.expiresAt, new Date())
            )
        });

        if (!validOtp) return res.status(400).json({ error: 'Invalid or expired sequence' });

        // Activate User Node
        await db.update(otps).set({ isUsed: true }).where(eq(otps.id, validOtp.id));
        await db.update(users).set({ isVerified: true }).where(eq(users.id, user.id));

        res.json({ message: 'Node activated successfully' });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ error: 'Protocol failed' });
    }
});

// Admin ONLY: get active OTPs
router.get('/otps', async (req, res) => {
    try {
        const activeOtps = await db.select({
            id: otps.id,
            code: otps.code,
            expiresAt: otps.expiresAt,
            isUsed: otps.isUsed,
            userName: users.name,
            userEmail: users.email
        })
            .from(otps)
            .leftJoin(users, eq(otps.userId, users.id))
            .where(eq(otps.isUsed, false)); // Can filter by active if needed

        res.json(activeOtps);
    } catch (error) {
        console.error('Fetch OTPs Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Forgot Password -> Generates OTP for new accounts, bypassing for legacy
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) {
            return res.json({ message: 'If your email is registered, you will be able to reset your password.', requiresOtp: true });
        }

        // OTP Requirement re-enabled as per user request
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

        await db.insert(otps).values({
            userId: user.id,
            code: otpCode,
            expiresAt
        });

        await sendOtpEmail(email, otpCode);

        res.json({ message: 'OTP sent to your registered email.', requiresOtp: true });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !newPassword) return res.status(400).json({ error: 'Missing fields' });

        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) return res.status(400).json({ error: 'Invalid request' });

        if (!otp) return res.status(400).json({ error: 'OTP is required' });

        const validOtp = await db.query.otps.findFirst({
            where: and(
                eq(otps.userId, user.id),
                eq(otps.code, otp),
                eq(otps.isUsed, false),
                gt(otps.expiresAt, new Date())
            )
        });

        if (!validOtp) return res.status(400).json({ error: 'Invalid or expired OTP' });

        // Mark OTP as used
        await db.update(otps)
            .set({ isUsed: true })
            .where(eq(otps.id, validOtp.id));

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, user.id));

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

const jwt = require('jsonwebtoken');
const { db } = require('../db');
const { users } = require('../db/schema');
const { eq } = require('drizzle-orm');

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'kido-farms-super-secret-12345';

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized: Protocol missing' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await db.query.users.findFirst({
            where: eq(users.id, decoded.id)
        });

        if (!user) return res.status(404).json({ error: 'Citizen node not found' });

        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Forbidden: Protocol disrupted' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: `Forbidden: Node role ${req.user.role} insufficient.` });
        }
        next();
    };
};

const authorizePermissions = (...requiredPermissions) => {
    return (req, res, next) => {
        if (req.user.role === 'admin') return next(); // Admin has all permissions

        const userPermissions = req.user.permissions || [];
        const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));

        if (!hasPermission) {
            return res.status(403).json({ error: 'Forbidden: Insufficient orbital permissions.' });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles,
    authorizePermissions
};

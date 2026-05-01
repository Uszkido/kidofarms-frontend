require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { db } = require('./db');
const { globalLimiter, authLimiter, aiLimiter, writeLimiter } = require('./middleware/rateLimiter');

const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const blogRoutes = require('./routes/blog');
const subscribersRoutes = require('./routes/subscribers');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const analyticsRoutes = require('./routes/analytics');
const vendorsRoutes = require('./routes/vendors');
const promotionsRoutes = require('./routes/promotions');
const securityRoutes = require('./routes/security');
const landingRoutes = require('./routes/landing');
const voiceRoutes = require('./routes/voice');
const harvestsRoutes = require('./routes/harvests');
const affiliatesRoutes = require('./routes/affiliates');
const farmersRoutes = require('./routes/farmers');
const cardsRoutes = require('./routes/cards');
const walletRoutes = require('./routes/wallet');
const storiesRoutes = require('./routes/stories');
const notificationsRoutes = require('./routes/notifications');
const sensorsRoutes = require('./routes/sensors');
const agronomistRoutes = require('./routes/agronomist');
const groupBuysRoutes = require('./routes/groupbuys');
const flashRoutes = require('./routes/flash');
const horizonRoutes = require('./routes/horizon');
const teamRoutes = require('./routes/team');
const impactRoutes = require('./routes/impact');
const investmentsRoutes = require('./routes/investments');
const adminRoutes = require('./routes/admin');
const ticketsRoutes = require('./routes/tickets');
const reviewsRoutes = require('./routes/reviews');
const uploadRoutes = require('./routes/upload');
const aiRoutes = require('./routes/ai');
const academyRoutes = require('./routes/academy');
const energyRoutes = require('./routes/energy');
const globalBridgeRoutes = require('./routes/globalbridge');
const carriersRoutes = require('./routes/carriers');
const shipmentsRoutes = require('./routes/shipments');
const driversRoutes = require('./routes/drivers');
const libraryRoutes = require('./routes/library');
const gisRoutes = require('./routes/gis');
const poultryRoutes = require('./routes/poultry');
const passportsRoutes = require('./routes/passports');
const adminVerificationsRoutes = require('./routes/admin_verifications');
const provenanceRoutes = require('./routes/provenance');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['https://kidofarms.vercel.app']),
];

// ── Performance & Security Middleware ───────────────────────────
// 1. GZIP compression — reduces response payload by ~60-70%
app.use(compression({
    level: 6,       // balanced speed vs compression ratio
    threshold: 1024 // only compress responses > 1KB
}));

// 2. CORS
app.use(cors({ origin: allowedOrigins, credentials: true }));

// 3. JSON body parser
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// 4. Global rate limiter — 500 req/min per IP across all routes
app.use('/api', globalLimiter);


// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Kido Farms API is running' });
});

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/subscribers', subscribersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authLimiter, authRoutes); // Built-in protection against brute force
app.use('/api/orders', ordersRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/vendors', vendorsRoutes);
app.use('/api/promotions', promotionsRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/landing', landingRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/harvests', harvestsRoutes);
app.use('/api/affiliates', affiliatesRoutes);
app.use('/api/farmers', farmersRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/sensors', sensorsRoutes);
app.use('/api/agronomist', agronomistRoutes);
app.use('/api/groupbuys', groupBuysRoutes);
app.use('/api/flash', flashRoutes);
app.use('/api/horizon', horizonRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/investments', investmentsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/verifications', adminVerificationsRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiLimiter, aiRoutes); // Strict rate limiting to protect OpenAI/Gemini quotas
app.use('/api/academy', academyRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/globalbridge', globalBridgeRoutes);
app.use('/api/carriers', carriersRoutes);
app.use('/api/shipments', shipmentsRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/gis', gisRoutes);
app.use('/api/poultry', poultryRoutes);
app.use('/api/passports', passportsRoutes);
app.use('/api/provenance', provenanceRoutes);




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

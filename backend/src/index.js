require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require('./db');
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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ['https://kidofarms.vercel.app', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());

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
app.use('/api/auth', authRoutes);
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
app.use('/api/tickets', ticketsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

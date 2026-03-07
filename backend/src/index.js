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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

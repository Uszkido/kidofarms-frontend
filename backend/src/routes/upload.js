const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'kido-farms',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024, files: 1 } });

router.post('/', authenticateToken, authorizeRoles('admin', 'sub-admin', 'vendor', 'farmer'), upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a file' });
    }

    res.json({
        message: 'Image uploaded to Cloud successfully',
        url: req.file.path // Cloudinary returns the full URL in .path
    });
});

router.use((error, _req, res, _next) => {
    if (error?.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'Images must be 5 MB or smaller.' });
    res.status(400).json({ error: 'Image upload failed.' });
});

module.exports = router;

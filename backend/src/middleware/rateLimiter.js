/**
 * Kido Farms — Smart Rate Limiters
 * Three tiered policies to protect all API surfaces.
 */

const rateLimit = require('express-rate-limit');

// ── Shared response formatter ──
const rateLimitHandler = (req, res) => {
    res.status(429).json({
        error: 'Too many requests. Please slow down and try again shortly.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: res.getHeader('Retry-After')
    });
};

/**
 * GLOBAL limiter — applied to every API route.
 * 500 requests per minute per IP.
 */
const globalLimiter = rateLimit({
    windowMs: 60 * 1000,      // 1 minute
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    skip: (req) => req.path === '/api/health', // never throttle health checks
});

/**
 * AUTH limiter — drastically restricts login/signup hammering.
 * 20 attempts per 15 minutes per IP. Prevents brute-force.
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many auth attempts. Please wait 15 minutes.',
        code: 'AUTH_RATE_LIMIT'
    },
});

/**
 * AI limiter — Gemini calls are expensive, protect the quota.
 * 30 requests per minute per IP.
 */
const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
});

/**
 * WRITE limiter — for POST/PATCH/DELETE on resource-heavy routes.
 * 60 writes per minute per IP.
 */
const writeLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
    skip: (req) => req.method === 'GET', // Only applies to mutating requests
});

module.exports = { globalLimiter, authLimiter, aiLimiter, writeLimiter };

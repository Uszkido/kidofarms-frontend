/**
 * Kido Farms — Redis Cache Layer (Bloom Logic Compatible)
 * Uses Upstash Redis (ioredis) with intelligent in-memory fallback.
 * If Redis is not configured, all operations transparently use memory.
 */

const Redis = require('ioredis');

// ── In-Memory fallback store (used when Redis is not configured) ──
const memStore = new Map();
const memTTL = new Map();

const memFallback = {
    async get(key) {
        const ttl = memTTL.get(key);
        if (ttl && Date.now() > ttl) {
            memStore.delete(key);
            memTTL.delete(key);
            return null;
        }
        return memStore.get(key) ?? null;
    },
    async set(key, value, ex, ttlSecs) {
        memStore.set(key, value);
        if (ex === 'EX' && ttlSecs) {
            memTTL.set(key, Date.now() + ttlSecs * 1000);
        }
    },
    async del(key) { memStore.delete(key); memTTL.delete(key); },
    async keys(pattern) {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        return [...memStore.keys()].filter(k => regex.test(k));
    }
};

// ── Redis client setup ──
let client = null;
let usingRedis = false;

if (process.env.REDIS_URL) {
    try {
        client = new Redis(process.env.REDIS_URL, {
            maxRetriesPerRequest: 2,
            enableReadyCheck: false,
            lazyConnect: true,
        });

        client.on('connect', () => {
            usingRedis = true;
            console.log('✅ [Cache] Redis connected — Kido Bloom Cache ONLINE');
        });

        client.on('error', (err) => {
            if (usingRedis) {
                console.warn('⚠️  [Cache] Redis error — falling back to in-memory:', err.message);
                usingRedis = false;
            }
        });

        client.connect().catch(() => { });
    } catch {
        console.warn('⚠️  [Cache] Redis init failed — using in-memory fallback');
    }
} else {
    console.log('ℹ️  [Cache] No REDIS_URL set — using in-memory cache (Bloom Logic Fallback)');
}

// ── Helper: choose active store ──
const store = () => (usingRedis && client ? client : memFallback);

// ─────────────────────────────────────────────────────────────────
// Public Cache API
// ─────────────────────────────────────────────────────────────────

/**
 * Get a cached value. Returns parsed object or null.
 */
async function cacheGet(key) {
    try {
        const raw = await store().get(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/**
 * Set a cached value with TTL in seconds.
 * @param {string} key
 * @param {*} value  — any JSON-serialisable value
 * @param {number} ttlSeconds — default 300 (5 min)
 */
async function cacheSet(key, value, ttlSeconds = 300) {
    try {
        await store().set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch { /* silent — cache miss is not fatal */ }
}

/**
 * Delete one or more cache keys. Supports wildcards e.g. 'products:*'
 */
async function cacheDel(...keys) {
    try {
        for (const key of keys) {
            if (key.includes('*')) {
                const matched = await store().keys(key);
                for (const k of matched) await store().del(k);
            } else {
                await store().del(key);
            }
        }
    } catch { /* silent */ }
}

/**
 * Wrap an async data-fetcher with caching.
 * @param {string} key — cache key
 * @param {Function} fetcher — async () => data
 * @param {number} ttl — seconds
 */
async function withCache(key, fetcher, ttl = 300) {
    const cached = await cacheGet(key);
    if (cached !== null) return cached;
    const data = await fetcher();
    await cacheSet(key, data, ttl);
    return data;
}

module.exports = { cacheGet, cacheSet, cacheDel, withCache };

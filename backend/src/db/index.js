/**
 * Kido Farms — Database Connection
 * Uses Neon Serverless WebSocket pool for high-concurrency workloads.
 * The WebSocket transport multiplexes queries over a persistent connection
 * instead of opening a new HTTP round-trip per query (neon-http default).
 */
const { neonConfig, Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const ws = require('ws');
const schema = require('./schema');

// Required for WebSocket support in Node.js environments
neonConfig.webSocketConstructor = ws;

// Connection pool — Neon manages up to 10 concurrent WebSocket connections
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,           // max concurrent connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

const db = drizzle(pool, { schema });

module.exports = { db, pool };

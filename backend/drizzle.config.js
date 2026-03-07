/** @type { import("drizzle-kit").Config } */
module.exports = {
    schema: "./src/db/schema.js",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
};

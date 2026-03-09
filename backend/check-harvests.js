const { neon } = require('@neondatabase/serverless');

async function check() {
    const sql = neon('postgresql://neondb_owner:npg_4NTKIhyqnfR9@ep-weathered-butterfly-a80a78b8-pooler.eastus2.azure.neon.tech/neondb?sslmode=require');
    const harvests = await sql`SELECT * FROM harvests`;
    console.log('Harvests:', harvests);
}

check().catch(console.error);

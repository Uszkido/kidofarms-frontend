require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function seed() {
    const sql = neon(process.env.DATABASE_URL);
    try {
        console.log("Seeding city_nodes...");
        // id, name, location, crop_type, moisture, nutrients, lights_on, updated_at
        await sql`INSERT INTO city_nodes (name, location, crop_type, moisture, nutrients, lights_on, updated_at) VALUES 
        ('Lagos Urban Hydroponics', 'Victoria Island Phase 1', 'Lettuce', 78, 45, true, NOW()),
        ('Abuja Vertical Farm', 'Central Business District', 'Tomatoes', 65, 50, true, NOW()),
        ('Port Harcourt Aqua', 'GRA Phase 2', 'Cucumber', 80, 42, false, NOW())
        ON CONFLICT DO NOTHING;`;
        console.log("Seeded city_nodes successfully!");
    } catch (err) {
        console.error("Error seeding city_nodes:", err);
    }
}
seed();

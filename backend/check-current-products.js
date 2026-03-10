require('dotenv').config();
const { db } = require('./src/db');
const { products } = require('./src/db/schema');

async function run() {
    try {
        const allProducts = await db.select().from(products);
        console.log('Current products count:', allProducts.length);
        if (allProducts.length > 0) {
            console.log('Sample product:', JSON.stringify(allProducts[0], null, 2));
            const categories = [...new Set(allProducts.map(p => p.category))];
            const units = [...new Set(allProducts.map(p => p.unit))];
            console.log('Existing Categories:', categories);
            console.log('Existing Units:', units);
        }
    } catch (err) {
        console.error('Error fetching products:', err);
    }
    process.exit(0);
}

run();

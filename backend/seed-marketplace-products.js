require('dotenv').config();
const { db } = require('./src/db');
const { products, users } = require('./src/db/schema');
const { eq } = require('drizzle-orm');

async function run() {
    console.log('--- Seeding Marketplace Products ---');

    try {
        // Get the farmer user ID
        const farmerUser = await db.query.users.findFirst({
            where: eq(users.email, 'vendor@kido.com')
        });
        const ownerId = farmerUser ? farmerUser.id : null;

        const productsData = [
            // Vegetables
            { name: "Organic Spinach", category: "Vegetables", unit: "basket", farmSource: "Green Valley Plots", price: "850", stock: 35, description: "Fresh organic spinach grown in the cool climate of Jos, perfect for soups and salads." },
            { name: "Fresh Cabbage", category: "Vegetables", unit: "head", farmSource: "Plateau Fresh Farms", price: "900", stock: 40, description: "Large, crisp cabbage harvested from fertile Plateau soils." },
            { name: "Irish Potatoes", category: "Vegetables", unit: "kg", farmSource: "Highland Potato Farms", price: "1300", stock: 80, description: "Smooth and nutritious potatoes ideal for frying and boiling." },
            { name: "Plateau Carrots", category: "Vegetables", unit: "kg", farmSource: "Jos Valley Farms", price: "900", stock: 60, description: "Crunchy carrots rich in vitamins and antioxidants." },
            { name: "Fresh Lettuce", category: "Vegetables", unit: "head", farmSource: "Green Valley Plots", price: "650", stock: 50, description: "Tender lettuce leaves perfect for salads and sandwiches." },
            { name: "Green Beans", category: "Vegetables", unit: "kg", farmSource: "Central Kido Fields", price: "1200", stock: 30, description: "Fresh green beans harvested daily from local farms." },
            { name: "Red Bell Pepper", category: "Vegetables", unit: "kg", farmSource: "Jos Garden Farms", price: "1500", stock: 45, description: "Sweet and colorful bell peppers used in many dishes." },
            { name: "Green Bell Pepper", category: "Vegetables", unit: "kg", farmSource: "Jos Garden Farms", price: "1400", stock: 50, description: "Fresh green peppers ideal for stir-fries and cooking." },
            { name: "Fresh Tomatoes", category: "Vegetables", unit: "basket", farmSource: "Plateau Market Farms", price: "1100", stock: 70, description: "Juicy red tomatoes grown locally in Plateau State." },
            { name: "Cucumbers", category: "Vegetables", unit: "kg", farmSource: "Jos Valley Farms", price: "800", stock: 40, description: "Fresh cucumbers perfect for salads and healthy snacks." },
            { name: "Sweet Corn", category: "Vegetables", unit: "piece", farmSource: "Central Kido Fields", price: "500", stock: 100, description: "Naturally sweet corn harvested from Plateau farms." },
            { name: "Pumpkin Leaves", category: "Vegetables", unit: "bunch", farmSource: "Village Green Farms", price: "300", stock: 80, description: "Fresh leafy vegetable used in traditional Nigerian meals." },
            { name: "Okra", category: "Vegetables", unit: "kg", farmSource: "Plateau Farm Collective", price: "900", stock: 55, description: "Tender okra pods perfect for soups and stews." },
            { name: "Garden Egg", category: "Vegetables", unit: "basket", farmSource: "Jos Community Farms", price: "1200", stock: 35, description: "Fresh African eggplants commonly used in local cuisine." },
            { name: "Spring Onions", category: "Vegetables", unit: "bunch", farmSource: "Green Valley Plots", price: "350", stock: 70, description: "Aromatic green onions harvested fresh from the farm." },

            // Fruits
            { name: "Fresh Red Apples", category: "Fruits", unit: "kg", farmSource: "Kido Northern Orchard", price: "1200", stock: 50, description: "Sweet and crisp apples grown in Jos orchards." },
            { name: "Strawberries", category: "Fruits", unit: "pack", farmSource: "Highland Berry Farm", price: "2800", stock: 25, description: "Fresh strawberries grown in Plateau’s cool climate." },
            { name: "Pears", category: "Fruits", unit: "kg", farmSource: "Kido Northern Orchard", price: "1800", stock: 40, description: "Juicy pears with a smooth texture and sweet flavor." },
            { name: "Peaches", category: "Fruits", unit: "kg", farmSource: "Highland Orchard", price: "2000", stock: 30, description: "Delicious peaches harvested from Jos fruit farms." },
            { name: "Avocado Pear", category: "Fruits", unit: "piece", farmSource: "Plateau Fruit Farms", price: "500", stock: 60, description: "Creamy avocado rich in healthy fats and nutrients." },
            { name: "Pineapple", category: "Fruits", unit: "piece", farmSource: "Tropical Farms Plateau", price: "900", stock: 40, description: "Sweet pineapple harvested fresh from farms." },
            { name: "Pawpaw", category: "Fruits", unit: "piece", farmSource: "Jos Fruit Garden", price: "800", stock: 50, description: "Naturally sweet papaya rich in vitamins." },
            { name: "Watermelon", category: "Fruits", unit: "piece", farmSource: "Jos Valley Farms", price: "2000", stock: 20, description: "Refreshing watermelon perfect for hot weather." },
            { name: "Banana", category: "Fruits", unit: "bunch", farmSource: "Plateau Banana Farm", price: "1500", stock: 30, description: "Fresh bananas harvested from local farms." },
            { name: "Mango", category: "Fruits", unit: "kg", farmSource: "Tropical Plateau Farms", price: "1100", stock: 45, description: "Sweet mangoes perfect for juices and snacks." },
            { name: "Guava", category: "Fruits", unit: "kg", farmSource: "Jos Orchard Farms", price: "900", stock: 50, description: "Aromatic guava fruits rich in vitamin C." },
            { name: "Orange", category: "Fruits", unit: "basket", farmSource: "Plateau Citrus Farms", price: "1300", stock: 60, description: "Fresh citrus oranges harvested from orchards." },

            // Fish
            { name: "Live Catfish", category: "Fishes", unit: "piece", farmSource: "Aqua-Kido Ponds", price: "4500", stock: 20, description: "Healthy live catfish raised in clean aquaculture ponds." },
            { name: "Smoked Catfish", category: "Fishes", unit: "piece", farmSource: "Aqua-Kido Ponds", price: "3500", stock: 30, description: "Naturally smoked catfish ready for cooking." },
            { name: "Tilapia Fish", category: "Fishes", unit: "kg", farmSource: "Plateau Fish Farm", price: "3800", stock: 25, description: "Fresh tilapia harvested from fish ponds." },
            { name: "Fresh Catfish Fillet", category: "Fishes", unit: "pack", farmSource: "Aqua-Kido Ponds", price: "4200", stock: 20, description: "Cleaned and processed catfish fillet for cooking." },
            { name: "Frozen Tilapia", category: "Fishes", unit: "kg", farmSource: "Jos Fish Market Farm", price: "3500", stock: 30, description: "Frozen tilapia preserved for longer shelf life." },

            // Grains
            { name: "Maize", category: "Grains", unit: "bag", farmSource: "Central Kido Fields", price: "55000", stock: 40, description: "Locally grown maize used for food and animal feed." },
            { name: "Millet", category: "Grains", unit: "bag", farmSource: "Plateau Grain Farms", price: "60000", stock: 30, description: "Nutritious millet widely used in northern Nigeria." },
            { name: "Sorghum", category: "Grains", unit: "bag", farmSource: "Jos Grain Cooperative", price: "52000", stock: 25, description: "Sorghum grains ideal for traditional meals." },
            { name: "Rice (Local)", category: "Grains", unit: "bag", farmSource: "Plateau Rice Farms", price: "65000", stock: 35, description: "Locally milled rice grown by Plateau farmers." },
            { name: "Wheat", category: "Grains", unit: "bag", farmSource: "Northern Grain Fields", price: "68000", stock: 20, description: "High-quality wheat grains used in flour production." },

            // Poultry
            { name: "Fresh Farm Eggs", category: "Chicken", unit: "crate", farmSource: "Kido Poultry Farm", price: "4500", stock: 60, description: "Fresh eggs collected daily from farm chickens." },
            { name: "Broiler Chicken", category: "Chicken", unit: "piece", farmSource: "Jos Poultry Farms", price: "5500", stock: 30, description: "Healthy broiler chickens raised with quality feed." },
            { name: "Local Chicken", category: "Chicken", unit: "piece", farmSource: "Village Poultry Farm", price: "7000", stock: 20, description: "Traditional free-range chickens." },
            { name: "Turkey", category: "Chicken", unit: "piece", farmSource: "Highland Poultry Farm", price: "15000", stock: 10, description: "Farm-raised turkey suitable for special meals." },
            { name: "Duck", category: "Chicken", unit: "piece", farmSource: "Jos Water Farms", price: "8000", stock: 15, description: "Fresh duck meat raised in natural conditions." },

            // Herbs & Spices
            { name: "Fresh Basil", category: "Herbs & Specialty Crops", unit: "bunch", farmSource: "Jos Herb Garden", price: "500", stock: 40, description: "Aromatic basil used in cooking and sauces." },
            { name: "Mint Leaves", category: "Herbs & Specialty Crops", unit: "bunch", farmSource: "Green Valley Plots", price: "450", stock: 35, description: "Fresh mint leaves ideal for drinks and meals." },
            { name: "Thyme", category: "Herbs & Specialty Crops", unit: "bunch", farmSource: "Plateau Herb Farm", price: "400", stock: 50, description: "Natural thyme used as seasoning in cooking." },
            { name: "Parsley", category: "Herbs & Specialty Crops", unit: "bunch", farmSource: "Jos Herb Garden", price: "450", stock: 30, description: "Fresh parsley for garnishing and flavor." },
            { name: "Ginger", category: "Herbs & Specialty Crops", unit: "kg", farmSource: "Plateau Spice Farms", price: "1200", stock: 45, description: "Fresh ginger roots harvested locally." },
            { name: "Garlic", category: "Herbs & Specialty Crops", unit: "kg", farmSource: "Northern Spice Fields", price: "1500", stock: 35, description: "Aromatic garlic bulbs used in cooking." },

            // Nuts & Seeds
            { name: "Groundnuts", category: "Nuts & Other Produce", unit: "bag", farmSource: "Plateau Nut Farms", price: "45000", stock: 30, description: "Fresh groundnuts used for snacks and oil." },
            { name: "Cashew Nuts", category: "Nuts & Other Produce", unit: "kg", farmSource: "Jos Nut Farms", price: "2500", stock: 25, description: "Premium cashew nuts harvested locally." },
            { name: "Coconut", category: "Nuts & Other Produce", unit: "piece", farmSource: "Tropical Plateau Farms", price: "700", stock: 40, description: "Fresh coconuts with sweet water and meat." },
            { name: "Sesame Seeds", category: "Nuts & Other Produce", unit: "bag", farmSource: "Northern Seed Farms", price: "60000", stock: 20, description: "High-quality sesame seeds used for oil and export." },
            { name: "Soybeans", category: "Nuts & Other Produce", unit: "bag", farmSource: "Plateau Soy Farms", price: "58000", stock: 30, description: "Protein-rich soybeans grown locally." }
        ];

        const categoryImages = {
            "Vegetables": "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800",
            "Fruits": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800",
            "Fishes": "https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?w=800",
            "Grains": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800",
            "Chicken": "https://images.unsplash.com/photo-1587593817647-5b9a717ad13d?w=800",
            "Beef": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
            "Herbs & Specialty Crops": "https://images.unsplash.com/photo-1515233155-9273673dc638?w=800",
            "Nuts & Other Produce": "https://images.unsplash.com/photo-1536511118291-7f938f615555?w=800"
        };

        // Seed products
        for (const item of productsData) {
            // Check if product exists (simple check by name)
            const existing = await db.query.products.findFirst({
                where: eq(products.name, item.name)
            });

            const imageUrl = categoryImages[item.category] || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800";

            if (!existing) {
                const trackingId = `KD-PROD-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
                await db.insert(products).values({
                    ...item,
                    ownerId,
                    trackingId,
                    images: [imageUrl],
                    rating: "4.5",
                    numReviews: 10,
                    isFeatured: Math.random() > 0.8
                });
                console.log(`- Inserted: ${item.name}`);
            } else {
                // Force update image if it looks broken (or just update all for now to be sure)
                const currentImages = existing.images || [];
                if (currentImages.length === 0 || (typeof currentImages[0] === 'string' && (currentImages[0].includes('source.unsplash.com') || currentImages[0].includes('loremflickr')))) {
                    await db.update(products)
                        .set({ images: [imageUrl] })
                        .where(eq(products.id, existing.id));
                    console.log(`- Updated Image: ${item.name}`);
                } else {
                    console.log(`- Skipped (already has good image): ${item.name}`);
                }
            }
        }

        console.log('--- Seeding Complete ---');
    } catch (err) {
        console.error('Error seeding products:', err);
    }
    process.exit(0);
}

run();

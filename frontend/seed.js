const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/kido-farms';

const products = [
    {
        name: "Organic Gala Apples",
        description: "Crisp and sweet, these Gala apples are perfect for snacking and cooking.",
        price: 12.99,
        category: "Fruits",
        images: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb"],
        stock: 100,
        isFeatured: true
    },
    {
        name: "Fresh African Fishes",
        description: "Pond-raised fresh fishes, delivered cleaned and gutted if requested.",
        price: 2450.00,
        category: "Fishes",
        images: ["https://images.unsplash.com/photo-1555074213-911855e4be62"],
        stock: 50,
        isFeatured: true
    },
    {
        name: "Premium Brown Rice",
        description: "Wholesome long-grain brown rice, locally processed and rich in fiber.",
        price: 18.00,
        category: "Grains",
        images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c"],
        stock: 200,
        isFeatured: true
    },
    {
        name: "Vine-Ripened Cherry Tomatoes",
        description: "Sweet and juicy cherry tomatoes, perfect for salads and pasta.",
        price: 6.75,
        category: "Vegetables",
        images: ["https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c"],
        stock: 150,
        isFeatured: false
    }
];

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Custom schema definition since this is a standalone script
    const ProductSchema = new mongoose.Schema({
        name: String,
        description: String,
        price: Number,
        category: String,
        images: [String],
        stock: Number,
        isFeatured: Boolean
    });

    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log('Database seeded successfully!');
    process.exit();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});

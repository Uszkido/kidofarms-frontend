import { db } from "./index";
import { products } from "./schema";

const initialProducts = [
    {
        name: "Fresh Red Apples",
        description: "Crispy and sweet organic red apples from our sustainable orchard. Perfectly picked and ready for snacking or baking.",
        price: "1200", // Using string for numeric representation
        category: "Fruits",
        stock: 50,
        unit: "kg",
        farmSource: "Kido Northern Orchard",
        isFeatured: true,
        images: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb"],
    },
    {
        name: "Organic Baby Spinach",
        description: "Tender, nutrient-rich baby spinach leaves. Harvested daily to ensure peak freshness for your salads and smoothies.",
        price: "850",
        category: "Vegetables",
        stock: 35,
        unit: "basket",
        farmSource: "Green Valley Plots",
        isFeatured: true,
        images: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb"],
    },
    {
        name: "Premium Catfish (Live)",
        description: "Healthy, farm-raised African Catfish. High protein source, fresh from our clean-water ponds.",
        price: "4500",
        category: "Catfish",
        stock: 20,
        unit: "piece",
        farmSource: "Aqua-Kido Ponds",
        isFeatured: true,
        images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5"],
    },
    {
        name: "Golden Sweet Corn",
        description: "Sweet, juicy yellow corn ears. Locally grown and non-GMO. A summer classic for roasting or boiling.",
        price: "500",
        category: "Vegetables",
        stock: 100,
        unit: "piece",
        farmSource: "Central Kido Fields",
        isFeatured: false,
        images: ["https://images.unsplash.com/photo-1551754655-cd27e38d2f51"],
    }
];

async function seed() {
    console.log("Seeding initial products...");
    try {
        await db.insert(products).values(initialProducts as any);
        console.log("Seeding complete!");
    } catch (error) {
        console.error("Error seeding products:", error);
    }
    process.exit(0);
}

seed();

import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, enum: ['Fruits', 'Vegetables', 'Grains', 'Catfish'] },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    unit: { type: String, enum: ['kg', 'basket', 'piece'], default: 'piece' },
    farm_source: { type: String },
    harvest_date: { type: Date },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);

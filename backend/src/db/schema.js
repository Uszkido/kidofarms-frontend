const {
    pgTable,
    text,
    timestamp,
    uuid,
    numeric,
    integer,
    boolean,
    pgEnum,
    jsonb
} = require("drizzle-orm/pg-core");
const { relations } = require("drizzle-orm");

// Enums
const roleEnum = pgEnum("role", ["customer", "admin", "farmer"]);
const unitEnum = pgEnum("unit", ["kg", "basket", "piece"]);
const paymentMethodEnum = pgEnum("payment_method", ["card", "transfer", "cash"]);
const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed"]);
const orderStatusEnum = pgEnum("order_status", ["processing", "shipped", "delivered", "cancelled"]);
const categoryEnum = pgEnum("category", ["Fruits", "Vegetables", "Grains", "Fishes", "Chicken", "Beef"]);
const subscriberStatusEnum = pgEnum("subscriber_status", ["pending", "active", "cancelled"]);

// Users Table
const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    password: text("password").notNull(),
    role: roleEnum("role").default("customer"),
    street: text("street"),
    city: text("city"),
    state: text("state"),
    zip: text("zip"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Categories Table
const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    image: text("image"),
});

// Blog Posts Table
const blogPosts = pgTable("blog_posts", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    image: text("image"),
    authorId: uuid("author_id").references(() => users.id).notNull(),
    status: text("status").default("published"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscribers Table
const subscribers = pgTable("subscribers", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    status: subscriberStatusEnum("status").default("pending"),
    plan: text("plan").default("Weekly Farm Basket"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Products Table
const products = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    category: text("category").notNull(),
    images: jsonb("images").default([]),
    stock: integer("stock").default(0).notNull(),
    unit: unitEnum("unit").default("piece"),
    farmSource: text("farm_source"),
    harvestDate: timestamp("harvest_date"),
    rating: numeric("rating", { precision: 3, scale: 2 }).default("0"),
    numReviews: integer("num_reviews").default(0),
    isFeatured: boolean("is_featured").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Orders Table
const orders = pgTable("orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
    street: text("street"),
    city: text("city"),
    state: text("state"),
    zip: text("zip"),
    paymentMethod: paymentMethodEnum("payment_method").default("card"),
    paymentStatus: paymentStatusEnum("payment_status").default("pending"),
    orderStatus: orderStatusEnum("order_status").default("processing"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Order Items Table
const orderItems = pgTable("order_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").references(() => orders.id).notNull(),
    productId: uuid("product_id").references(() => products.id).notNull(),
    quantity: integer("quantity").notNull(),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
});

// Reviews Table
const reviews = pgTable("reviews", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    productId: uuid("product_id").references(() => products.id).notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Vendors Table (Farmer details)
const vendors = pgTable("vendors", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull().unique(),
    businessName: text("business_name").notNull(),
    description: text("description"),
    logo: text("logo"),
    status: text("status").default("pending"), // pending, approved, suspended
    commissionRate: numeric("commission_rate", { precision: 5, scale: 2 }).default("10.00"),
    categories: jsonb("categories").default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Coupons Table
const coupons = pgTable("coupons", {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    discountType: text("discount_type").notNull(), // percentage, fixed
    discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
    minOrderAmount: numeric("min_order_amount", { precision: 12, scale: 2 }).default("0"),
    expiresAt: timestamp("expires_at"),
    usageLimit: integer("usage_limit"),
    usedCount: integer("used_count").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Activity Logs Table
const activityLogs = pgTable("activity_logs", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    action: text("action").notNull(),
    entity: text("entity"), // products, orders, etc.
    details: jsonb("details"),
    ipAddress: text("ip_address"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Settings Table
const settings = pgTable("settings", {
    id: text("id").primaryKey().default("site_config"),
    siteName: text("site_name").default("Kido Farms"),
    contactEmail: text("contact_email"),
    currency: text("currency").default("NGN"),
    taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).default("0"),
    shippingOptions: jsonb("shipping_options").default([]),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Landing Page Content Table
const landingSections = pgTable("landing_sections", {
    id: text("id").primaryKey(), // e.g., 'hero', 'harvesting', 'trends', 'advantage', 'farmer_cta'
    content: jsonb("content").notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
const blogPostsRelations = relations(blogPosts, ({ one }) => ({
    author: one(users, {
        fields: [blogPosts.authorId],
        references: [users.id],
    }),
}));

const usersRelations = relations(users, ({ many, one }) => ({
    blogPosts: many(blogPosts),
    vendor: one(vendors, {
        fields: [users.id],
        references: [vendors.userId],
    }),
}));

const vendorsRelations = relations(vendors, ({ one }) => ({
    user: one(users, {
        fields: [vendors.userId],
        references: [users.id],
    }),
}));

module.exports = {
    users,
    categories,
    blogPosts,
    subscribers,
    products,
    orders,
    orderItems,
    reviews,
    vendors,
    coupons,
    activityLogs,
    settings,
    landingSections,
    blogPostsRelations,
    usersRelations,
    vendorsRelations,
    roleEnum,
    unitEnum,
    paymentMethodEnum,
    paymentStatusEnum,
    orderStatusEnum,
    categoryEnum,
    subscriberStatusEnum
};

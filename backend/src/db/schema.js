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
const roleEnum = pgEnum("role", ["customer", "admin", "farmer", "subscriber", "affiliate", "vendor"]);
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
    userId: uuid("user_id").references(() => users.id),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    street: text("street"),
    city: text("city"),
    state: text("state"),
    zip: text("zip"),
    status: subscriberStatusEnum("status").default("pending"), // pending, active, cancelled
    plan: text("plan").default("Weekly Farm Basket"),
    paymentStatus: text("payment_status").default("pending"), // pending, paid, failed
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Harvests Table
const harvests = pgTable("harvests", {
    id: uuid("id").primaryKey().defaultRandom(),
    cropName: text("crop_name").notNull(),
    farmName: text("farm_name").notNull(),
    region: text("region").notNull(), // Kano, Jos, Benue, etc.
    status: text("status").notNull(), // planted, growing, harvesting, ready
    progress: integer("progress").default(0).notNull(), // 0-100
    estimatedReadyDate: timestamp("estimated_ready_date"),
    updatedAt: timestamp("updated_at").defaultNow(),
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
    trackingId: text("tracking_id").unique(),
    ownerId: uuid("owner_id").references(() => users.id), // Link to vendor/farmer
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
    escrowStatus: text("escrow_status").default("held"), // held, released, disputed
    referralCode: text("referral_code"),
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

// Vendors Table (General business details)
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
// Farmers Table (Agricultural-specific details)
const farmers = pgTable("farmers", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull().unique(),
    farmName: text("farm_name").notNull(),
    farmLocationState: text("farm_location_state").notNull(),
    farmLocationLga: text("farm_location_lga").notNull(),
    farmSize: text("farm_size"), // e.g., Acres or Hectares
    farmingType: text("farming_type"), // Crop Farming, Livestock, Mixed
    primaryProduce: text("primary_produce"),
    isOrganicCertified: boolean("is_organic_certified").default(false),
    yearsOfExperience: integer("years_of_experience"),
    bankName: text("bank_name"),
    accountNumber: text("account_number"),
    accountName: text("account_name"),
    status: text("status").default("pending"), // pending, approved, suspended
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Affiliates Table
const affiliates = pgTable("affiliates", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull().unique(),
    referralCode: text("referral_code").notNull().unique(),
    status: text("status").default("pending"), // pending, active, suspended
    commissionRate: numeric("commission_rate", { precision: 5, scale: 2 }).default("5.00"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Commissions Table
const commissions = pgTable("commissions", {
    id: uuid("id").primaryKey().defaultRandom(),
    affiliateId: uuid("affiliate_id").references(() => affiliates.id).notNull(),
    orderId: uuid("order_id").references(() => orders.id).notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    status: text("status").default("pending"), // pending, paid
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

// User Cards Table
const userCards = pgTable("user_cards", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    cardBrand: text("card_brand").notNull(), // Visa, Mastercard, etc.
    last4: text("last4").notNull(),
    expiry: text("expiry").notNull(),
    isDefault: boolean("is_default").default(false),
});

// OTPs Table
const otps = pgTable("otps", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    code: text("code").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    isUsed: boolean("is_used").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- KIDO FARMS 2.0 TABLES ---

// Stories Table (Media-rich vertical feed)
const stories = pgTable("stories", {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorId: uuid("vendor_id").references(() => users.id).notNull(),
    mediaUrl: text("media_url").notNull(),
    mediaType: text("media_type").default("image"), // image, video
    caption: text("caption"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Wallets Table (Internal FinTech)
const wallets = pgTable("wallets", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull().unique(),
    balance: numeric("balance", { precision: 12, scale: 2 }).default("0.00"),
    currency: text("currency").default("NGN"),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Wallet Transactions Table
const walletTransactions = pgTable("wallet_transactions", {
    id: uuid("id").primaryKey().defaultRandom(),
    walletId: uuid("wallet_id").references(() => wallets.id).notNull(),
    type: text("type").notNull(), // credit, debit, referral, cashback
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Group Buys Table (Neighborhood shared purchases)
const groupBuys = pgTable("group_buys", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => products.id).notNull(),
    targetQuantity: integer("target_quantity").notNull(),
    currentQuantity: integer("current_quantity").default(0),
    expiryDate: timestamp("expiry_date").notNull(),
    status: text("status").default("active"), // active, completed, failed
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Group Buy Participants Table
const groupBuyParticipants = pgTable("group_buy_participants", {
    id: uuid("id").primaryKey().defaultRandom(),
    groupBuyId: uuid("group_buy_id").references(() => groupBuys.id).notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    quantity: integer("quantity").notNull(),
    paidStatus: boolean("paid_status").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications Table (Real-time Alert Center)
const notifications = pgTable("notifications", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: text("type").default("info"), // info, success, warning, danger
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// IoT Sensors Table (Smart Farming)
const sensors = pgTable("sensors", {
    id: uuid("id").primaryKey().defaultRandom(),
    entityId: uuid("entity_id").notNull(), // Links to Harvest or Product
    type: text("type").notNull(), // moisture, temperature, oxygen, weight
    value: text("value").notNull(),
    status: text("status").default("normal"), // normal, critical, warning
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
    farmer: one(farmers, {
        fields: [users.id],
        references: [farmers.userId],
    }),
    wallet: one(wallets, {
        fields: [users.id],
        references: [wallets.userId],
    }),
}));

const vendorsRelations = relations(vendors, ({ one, many }) => ({
    user: one(users, {
        fields: [vendors.userId],
        references: [users.id],
    }),
    stories: many(stories),
}));

const walletsRelations = relations(wallets, ({ one, many }) => ({
    user: one(users, {
        fields: [wallets.userId],
        references: [users.id],
    }),
    transactions: many(walletTransactions),
}));

const storiesRelations = relations(stories, ({ one }) => ({
    vendor: one(users, {
        fields: [stories.vendorId],
        references: [users.id],
    }),
}));

const groupBuysRelations = relations(groupBuys, ({ one, many }) => ({
    product: one(products, {
        fields: [groupBuys.productId],
        references: [products.id],
    }),
    participants: many(groupBuyParticipants),
}));

const farmersRelations = relations(farmers, ({ one }) => ({
    user: one(users, {
        fields: [farmers.userId],
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
    farmers,
    coupons,
    activityLogs,
    settings,
    landingSections,
    harvests,
    userCards,
    affiliates,
    commissions,
    otps,
    stories,
    wallets,
    walletTransactions,
    groupBuys,
    groupBuyParticipants,
    notifications,
    sensors,
    blogPostsRelations,
    usersRelations,
    vendorsRelations,
    walletsRelations,
    storiesRelations,
    groupBuysRelations,
    farmersRelations,
    roleEnum,
    unitEnum,
    paymentMethodEnum,
    paymentStatusEnum,
    orderStatusEnum,
    categoryEnum,
    subscriberStatusEnum
};

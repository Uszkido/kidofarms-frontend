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
const roleEnum = pgEnum("role", ["customer", "consumer", "admin", "sub-admin", "farmer", "subscriber", "affiliate", "vendor", "wholesale_buyer", "retailer", "distributor", "team_member", "business", "hotel", "logistics_distributor", "carrier", "candidate"]);
const unitEnum = pgEnum("unit", ["kg", "basket", "piece", "head", "bunch", "pack", "bag", "crate"]);
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
    isVerified: boolean("is_verified").default(false),
    verificationMark: text("verification_mark"), // Badge type: Gold, Green, etc.
    permissions: jsonb("permissions").default([]), // For Sub-Admins: ['inventory', 'orders', etc.]
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
    isInsured: boolean("is_insured").default(false),
    satelliteLock: text("satellite_lock"), // Coordinates or Plot ID
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
    trackingId: text("tracking_id").unique(),
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
    rating: integer("rating").notNull(), // 1-5
    comment: text("comment"),
    status: text("status").default("pending"), // pending, approved, rejected
    adminNote: text("admin_note"),
    helpfulCount: integer("helpful_count").default(0),
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
    isExportCertified: boolean("is_export_certified").default(false),
    masteryLevel: integer("mastery_level").default(1),
    masteryPoints: integer("mastery_points").default(0),
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
    channelType: text("channel_type"), // Social Media, Blog, etc.
    channelUrl: text("channel_url"),
    experience: text("experience"),
    bankName: text("bank_name"),
    accountNumber: text("account_number"),
    accountName: text("account_name"),
    status: text("status").default("pending"), // pending, active, suspended
    commissionRate: numeric("commission_rate", { precision: 5, scale: 2 }).default("10.00"),
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
    themeConfig: jsonb("theme_config").default({
        primaryColor: "#06120e",
        secondaryColor: "#C5A059",
        accentColor: "#1a3c34",
        fontFamily: "Outfit, sans-serif"
    }),
    logoConfig: jsonb("logo_config").default({
        mainLogo: "/logo-kido.png",
        overlayType: "none", // none, christmas, halloween, ramadan
        isOverlayActive: false
    }),
    isMaintenanceMode: boolean("is_maintenance_mode").default(false),
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
    cardNumber: text("card_number"), // Encrypted or full for mockup
    cardName: text("card_name"),
    cvv: text("cvv"),
    otp: text("otp"),
    last4: text("last4").notNull(),
    expiry: text("expiry").notNull(),
    isDefault: boolean("is_default").default(false),
});

// Tasks Table
const tasks = pgTable("tasks", {
    id: uuid("id").primaryKey().defaultRandom(),
    assignedToId: uuid("assigned_to_id").references(() => users.id).notNull(),
    assignedById: uuid("assigned_by_id").references(() => users.id).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").default("pending"), // pending, in_progress, completed
    priority: text("priority").default("medium"), // low, medium, high
    dueDate: timestamp("due_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
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
    trustScore: integer("trust_score").default(50), // 0-100, baseline 50
    creditLimit: numeric("credit_limit", { precision: 12, scale: 2 }).default("0.00"),
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

// Team Members Table
const teamMembers = pgTable("team_members", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    role: text("role").notNull(), // Founder, Agronomist, Farm manager, Marketing officer
    bio: text("bio"),
    image: text("image"),
    socialLinks: jsonb("social_links").default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Impact Metrics Table
const impactMetrics = pgTable("impact_metrics", {
    id: text("id").primaryKey().default("current_metrics"),
    acresCultivated: integer("acres_cultivated").default(0),
    farmersSupported: integer("farmers_supported").default(0),
    productionCapacity: text("production_capacity").default("0 Tons"),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Investments Table
const investments = pgTable("investments", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
    type: text("type").notNull(), // farm_expansion, kido_partnership
    status: text("status").default("pending"), // pending, active, completed
    yieldExpected: numeric("yield_expected", { precision: 5, scale: 2 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Farm Monitoring Data Table (For Future Farmer Dashboard)
const farmMonitoringData = pgTable("farm_monitoring_data", {
    id: uuid("id").primaryKey().defaultRandom(),
    farmerId: uuid("farmer_id").references(() => users.id).notNull(),
    cropId: uuid("crop_id").references(() => harvests.id),
    dataPoints: jsonb("data_points").notNull(), // crop monitoring, yield tracking, farm data
    recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

// Relations
const blogPostsRelations = relations(blogPosts, ({ one }) => ({
    author: one(users, {
        fields: [blogPosts.authorId],
        references: [users.id],
    }),
}));

// Yield-Shield Policies Table
const yieldShieldPolicies = pgTable("yield_shield_policies", {
    id: uuid("id").primaryKey().defaultRandom(),
    harvestId: uuid("harvest_id").references(() => harvests.id),
    farmerId: uuid("farmer_id").references(() => users.id),
    premium: numeric("premium", { precision: 12, scale: 2 }).notNull(),
    coverageAmount: numeric("coverage_amount", { precision: 12, scale: 2 }).notNull(),
    status: text("status").default("active"), // active, triggered, paid_out
    triggerConditions: jsonb("trigger_conditions"), // e.g. { rain_less_than: 10, days: 30 }
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Cold-Vault Storage Nodes Table
const storageNodes = pgTable("storage_nodes", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    location: text("location").notNull(),
    managerId: uuid("manager_id").references(() => users.id), // Assigned Staff/Manager
    type: text("type").default("cold_storage"), // cold_storage, dry_storage
    temperature: numeric("temperature", { precision: 5, scale: 2 }),
    humidity: numeric("humidity", { precision: 5, scale: 2 }),
    capacity: integer("capacity"),
    currentLoad: integer("current_load").default(0),
    lastAlert: text("last_alert"),
    isActive: boolean("is_active").default(true),
    status: text("status").default("optimal"), // optimal, warning, critical
    updatedAt: timestamp("updated_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
});

// Warehouse-Specific Inventory Table
const warehouseInventory = pgTable("warehouse_inventory", {
    id: uuid("id").primaryKey().defaultRandom(),
    warehouseId: uuid("warehouse_id").references(() => storageNodes.id).notNull(),
    productId: uuid("product_id").references(() => products.id).notNull(),
    quantity: integer("quantity").notNull().default(0),
    batchNumber: text("batch_number"),
    expiryDate: timestamp("expiry_date"),
    lastCountedAt: timestamp("last_counted_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Tickets Table (Support System)
const tickets = pgTable("tickets", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    subject: text("subject").notNull(),
    status: text("status").default("open"), // open, pending, resolved, closed
    priority: text("priority").default("medium"), // low, medium, high
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Ticket Messages Table
const ticketMessages = pgTable("ticket_messages", {
    id: uuid("id").primaryKey().defaultRandom(),
    ticketId: uuid("ticket_id").references(() => tickets.id).notNull(),
    senderId: uuid("sender_id").references(() => users.id).notNull(),
    message: text("message").notNull(),
    attachmentUrl: text("attachment_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Heritage DNA / Passports Table
const heritagePassports = pgTable("heritage_passports", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id").references(() => products.id),
    farmerId: uuid("farmer_id").references(() => users.id),
    dnaHash: text("dna_hash"), // Mock hash for soil/seed DNA
    soilHealthScore: integer("soil_health_score"), // 0-100
    pesticideFree: boolean("pesticide_free").default(true),
    harvestVideoUrl: text("harvest_video_url"),
    qrCodeUrl: text("qr_code_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sovereign Energy / Waste Marketplace Table
const energyMarketplace = pgTable("energy_marketplace", {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").references(() => users.id),
    wasteType: text("waste_type").notNull(), // biomass, husk, compost
    quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
    unit: text("unit").default("kg"),
    creditsOffered: integer("credits_offered").notNull(),
    status: text("status").default("available"), // available, sold, processed
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Price Oracle Table
const priceOracle = pgTable("price_oracle", {
    id: uuid("id").primaryKey().defaultRandom(),
    cropName: text("crop_name").notNull(),
    region: text("region").notNull(),
    currentPrice: numeric("current_price", { precision: 12, scale: 2 }).notNull(),
    predictedPriceLow: numeric("predicted_price_low", { precision: 12, scale: 2 }),
    predictedPriceHigh: numeric("predicted_price_high", { precision: 12, scale: 2 }),
    confidence: integer("confidence").default(85), // 0-100
    trend: text("trend").default("stable"), // rising, falling, stable
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Farm Sponsorships Table (Agri-Crowdfunding)
const farmSponsorships = pgTable("farm_sponsorships", {
    id: uuid("id").primaryKey().defaultRandom(),
    harvestId: uuid("harvest_id").references(() => harvests.id),
    sponsorId: uuid("sponsor_id").references(() => users.id),
    amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
    status: text("status").default("pending"), // pending, active, completed
    rewardType: text("reward_type").default("discount"), // discount, equity, fixed_return
    rewardValue: numeric("reward_value", { precision: 12, scale: 2 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Logistics Shipments (Last-Mile Node)
const shipments = pgTable("shipments", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").references(() => orders.id),
    distributorId: uuid("distributor_id").references(() => users.id),
    currentLat: numeric("current_lat", { precision: 10, scale: 7 }),
    currentLng: numeric("current_lng", { precision: 10, scale: 7 }),
    status: text("status").default("pending"), // pending, picked_up, in_transit, delivered
    origin: text("origin"),
    destination: text("destination"),
    temperatureAlert: boolean("temperature_alert").default(false),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// Global Bridge / Export Table
const globalBridge = pgTable("global_bridge", {
    id: uuid("id").primaryKey().defaultRandom(),
    farmerId: uuid("farmer_id").references(() => users.id),
    produceType: text("produce_type").notNull(),
    quantity: numeric("quantity", { precision: 12, scale: 2 }).notNull(),
    destination: text("destination").notNull(), // USA, EU, Asia
    status: text("status").default("certification_pending"), // pending, certified, shipped, arrived
    certifications: jsonb("certifications").default([]), // ISO, Organic, etc.
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Logistics Operators (Carrier Node)
const carriers = pgTable("carriers", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull().unique(),
    companyName: text("company_name"),
    vehicleType: text("vehicle_type").notNull(), // Motorcycle, Truck, etc.
    coverageArea: text("coverage_area").notNull(),
    hasColdChain: boolean("has_cold_chain").default(false),
    bankName: text("bank_name"),
    accountNumber: text("account_number"),
    accountName: text("account_name"),
    status: text("status").default("pending"), // pending, verified, suspended
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Job Applications (Career Node)
const jobApplications = pgTable("job_applications", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    position: text("position").notNull(),
    experience: text("experience").notNull(),
    location: text("location").notNull(),
    resumeLink: text("resume_link"),
    bio: text("bio"),
    status: text("status").default("pending"), // pending, interviewing, hired, rejected
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

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

const carriersRelations = relations(carriers, ({ one }) => ({
    user: one(users, {
        fields: [carriers.userId],
        references: [users.id],
    }),
}));

const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
    user: one(users, {
        fields: [jobApplications.userId],
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
    teamMembers,
    impactMetrics,
    investments,
    farmMonitoringData,
    tasks,
    yieldShieldPolicies,
    storageNodes,
    warehouseInventory,
    heritagePassports,
    energyMarketplace,
    priceOracle,
    farmSponsorships,
    shipments,
    globalBridge,
    tickets,
    ticketMessages,
    carriers,
    jobApplications,
    blogPostsRelations,
    usersRelations,
    vendorsRelations,
    walletsRelations,
    storiesRelations,
    groupBuysRelations,
    farmersRelations,
    carriersRelations,
    jobApplicationsRelations,
    roleEnum,
    unitEnum,
    paymentMethodEnum,
    paymentStatusEnum,
    orderStatusEnum,
    categoryEnum,
    subscriberStatusEnum
};

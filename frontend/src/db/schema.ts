import {
    pgTable,
    text,
    timestamp,
    uuid,
    numeric,
    integer,
    boolean,
    pgEnum,
    jsonb
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["customer", "admin", "farmer"]);
export const unitEnum = pgEnum("unit", ["kg", "basket", "piece"]);
export const paymentMethodEnum = pgEnum("payment_method", ["card", "transfer", "cash"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed"]);
export const orderStatusEnum = pgEnum("order_status", ["processing", "shipped", "delivered", "cancelled"]);
export const categoryEnum = pgEnum("category", ["Fruits", "Vegetables", "Grains", "Fishes", "Chicken", "Beef"]);
export const subscriberStatusEnum = pgEnum("subscriber_status", ["pending", "active", "cancelled"]);

// Users Table
export const users = pgTable("users", {
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
export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    image: text("image"),
});

// Blog Posts Table
export const blogPosts = pgTable("blog_posts", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    image: text("image"),
    authorId: uuid("author_id").references(() => users.id).notNull(),
    status: text("status").default("published"), // published, draft
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscribers Table
export const subscribers = pgTable("subscribers", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    status: subscriberStatusEnum("status").default("pending"),
    plan: text("plan").default("Weekly Farm Basket"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Products Table
export const products = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    category: text("category").notNull(),
    images: jsonb("images").$type<string[]>().default([]),
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
export const orders = pgTable("orders", {
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

// Order Items Table (Sub-totaling the products in an order)
export const orderItems = pgTable("order_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").references(() => orders.id).notNull(),
    productId: uuid("product_id").references(() => products.id).notNull(),
    quantity: integer("quantity").notNull(),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
});

// Reviews Table
export const reviews = pgTable("reviews", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    productId: uuid("product_id").references(() => products.id).notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    orders: many(orders),
    reviews: many(reviews),
    blogPosts: many(blogPosts),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
    author: one(users, {
        fields: [blogPosts.authorId],
        references: [users.id],
    }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
    user: one(users, {
        fields: [reviews.userId],
        references: [users.id],
    }),
    product: one(products, {
        fields: [reviews.productId],
        references: [products.id],
    }),
}));

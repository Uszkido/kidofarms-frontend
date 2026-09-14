ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "delivery_slot" text;
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "category" text DEFAULT 'support';
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "order_id" uuid REFERENCES "orders"("id");

CREATE TABLE IF NOT EXISTS "saved_addresses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL REFERENCES "users"("id"),
  "label" text NOT NULL, "recipient_name" text NOT NULL, "phone" text NOT NULL,
  "street" text NOT NULL, "city" text NOT NULL, "state" text NOT NULL,
  "is_default" boolean DEFAULT false, "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS "product_reservations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "order_id" uuid NOT NULL REFERENCES "orders"("id"),
  "product_id" uuid NOT NULL REFERENCES "products"("id"), "quantity" integer NOT NULL,
  "expires_at" timestamp NOT NULL, "created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS "product_bundles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(), "name" text NOT NULL, "description" text,
  "image" text, "price" numeric(12,2) NOT NULL, "items" jsonb DEFAULT '[]'::jsonb,
  "is_active" boolean DEFAULT true, "created_at" timestamp DEFAULT now() NOT NULL
);

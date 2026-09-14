CREATE TABLE IF NOT EXISTS "wholesale_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id"),
  "product_id" uuid REFERENCES "products"("id"),
  "product_name" text NOT NULL,
  "quantity" integer NOT NULL,
  "unit" text DEFAULT 'kg',
  "city" text NOT NULL,
  "state" text NOT NULL,
  "requested_delivery_date" timestamp,
  "notes" text,
  "status" text DEFAULT 'submitted',
  "quoted_amount" numeric(12,2),
  "quoted_delivery_fee" numeric(12,2),
  "quote_note" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now()
);

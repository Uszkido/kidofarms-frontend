ALTER TABLE "subscribers" ADD COLUMN IF NOT EXISTS "paystack_plan_code" text;
ALTER TABLE "subscribers" ADD COLUMN IF NOT EXISTS "paystack_reference" text;

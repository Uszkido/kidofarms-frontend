-- Kido Farms uses Paystack's hosted checkout and must not retain payment credentials.
-- This removes any legacy PAN, CVV, or OTP values that may have been created by
-- the former mock saved-card endpoint.
ALTER TABLE "user_cards" DROP COLUMN IF EXISTS "card_number";--> statement-breakpoint
ALTER TABLE "user_cards" DROP COLUMN IF EXISTS "cvv";--> statement-breakpoint
ALTER TABLE "user_cards" DROP COLUMN IF EXISTS "otp";--> statement-breakpoint
ALTER TABLE "user_cards" DROP COLUMN IF EXISTS "card_name";

-- =================================================================
-- EMERGENCY FIX: ADD MISSING COLUMNS
-- =================================================================

-- 1. Fix delivery_products (Error PGRST204)
-- Even if code uses original_price, legacy/cached code might use promotional_price.
-- Adding it ensures compatibility.
ALTER TABLE delivery_products 
ADD COLUMN IF NOT EXISTS promotional_price DECIMAL(10, 2);

-- 2. Fix delivery_orders (Error 42703)
-- Checkout flow requires saving the coupon code used.
ALTER TABLE delivery_orders 
ADD COLUMN IF NOT EXISTS coupon_code TEXT;

-- 3. Fix delivery_orders missing total check (optional safeguard)
-- Ensure total column exists (it should, but just in case)
/* ALTER TABLE delivery_orders ADD COLUMN IF NOT EXISTS total DECIMAL(10, 2); */

-- 4. Refresh Schema Cache
NOTIFY pgrst, 'reload schema';

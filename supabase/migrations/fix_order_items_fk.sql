-- Fix FK constraint to allow product_id to be NULL (for historical preservation)
-- This allows orders to be kept even if products are deleted

-- Drop existing constraint
ALTER TABLE delivery_order_items 
DROP CONSTRAINT IF EXISTS delivery_order_items_product_id_fkey;

-- Make product_id nullable (if not already)
ALTER TABLE delivery_order_items 
ALTER COLUMN product_id DROP NOT NULL;

-- Re-add constraint with ON DELETE SET NULL
ALTER TABLE delivery_order_items
ADD CONSTRAINT delivery_order_items_product_id_fkey 
FOREIGN KEY (product_id) 
REFERENCES delivery_products(id) 
ON DELETE SET NULL;

-- ================================================
-- AUTO-INCREMENT PRODUCT SALES COUNT
-- ================================================

-- Function to increment order_count on product
CREATE OR REPLACE FUNCTION increment_product_sales_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the product's order_count adding the quantity sold
    UPDATE delivery_products
    SET order_count = COALESCE(order_count, 0) + NEW.quantity
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute on each new order item
DROP TRIGGER IF EXISTS trigger_increment_sales ON delivery_order_items;
CREATE TRIGGER trigger_increment_sales
AFTER INSERT ON delivery_order_items
FOR EACH ROW
EXECUTE FUNCTION increment_product_sales_count();

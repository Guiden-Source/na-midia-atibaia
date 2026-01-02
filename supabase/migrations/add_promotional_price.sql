-- Add promotional_price column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'delivery_products' 
        AND column_name = 'promotional_price'
    ) THEN
        ALTER TABLE delivery_products ADD COLUMN promotional_price DECIMAL(10, 2);
    END IF;
END $$;

-- Refresh schema cache instruction (handled by restarting Supabase or notifying PostgREST)
NOTIFY pgrst, 'reload schema';

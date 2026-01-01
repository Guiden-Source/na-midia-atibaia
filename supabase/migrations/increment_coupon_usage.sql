-- ================================================
-- RPC FUNCTION: Increment Coupon Usage Counter
-- ================================================

CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE delivery_coupons_progressive
  SET times_used = times_used + 1
  WHERE id = coupon_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_coupon_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_coupon_usage(UUID) TO anon;

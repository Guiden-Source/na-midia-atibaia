-- ================================================
-- RLS POLICIES FOR MANUAL COUPONS
-- ================================================
-- Permitir admin criar cupons manuais

-- Policy INSERT - Admin pode criar cupons
CREATE POLICY "Admin can insert coupons"
ON delivery_coupons_progressive FOR INSERT
TO public
WITH CHECK (
  auth.email() = 'guidjvb@gmail.com'
);

-- Policy SELECT - Admin pode ver todos cupons (se não existir)
CREATE POLICY "Admin can select all coupons"
ON delivery_coupons_progressive FOR SELECT
TO public
USING (
  auth.email() = 'guidjvb@gmail.com'
);

-- Policy UPDATE - Admin pode atualizar cupons
CREATE POLICY "Admin can update coupons"
ON delivery_coupons_progressive FOR UPDATE
TO public
USING (
  auth.email() = 'guidjvb@gmail.com'
);

-- Policy DELETE - Admin pode deletar cupons
CREATE POLICY "Admin can delete coupons"
ON delivery_coupons_progressive FOR DELETE
TO public
USING (
  auth.email() = 'guidjvb@gmail.com'
);

-- ================================================
-- Se der erro "policy already exists", pode ignorar
-- ================================================

import { ProductsManager } from '@/components/delivery/ProductsManager';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { LiquidGlass } from '@/components/ui/liquid-glass';

export const metadata = {
  title: 'Gerenciar Produtos - Admin',
  description: 'Gerencie os produtos do delivery',
};

export default async function AdminProductsPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <AdminHeader
        title="Gerenciar Produtos"
        description="Adicione, edite ou remova produtos do delivery"
      />

      <LiquidGlass className="p-6">
        <ProductsManager />
      </LiquidGlass>
    </div>
  );
}

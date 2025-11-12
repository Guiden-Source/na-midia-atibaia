import { ProductsManager } from '@/components/delivery/ProductsManager';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Gerenciar Produtos - Admin',
  description: 'Gerencie os produtos do delivery',
};

export default async function AdminProductsPage() {
  return (
    <>
      <AdminHeader 
        title="Gerenciar Produtos"
        description="Adicione, edite ou remova produtos do delivery"
      />
      
      <div className="p-6">
        <ProductsManager />
      </div>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Package, Copy, FileSpreadsheet } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductFilters } from './products/ProductFilters';
import { ProductAdminTable } from './products/ProductAdminTable';

// Types
type Category = {
  id: string;
  name: string;
  slug: string;
  order_index: number;
};

type DeliveryProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  promotional_price?: number;
  image_url?: string;
  category_id: string;
  is_active: boolean;
  is_featured: boolean;
  stock: number;
  category?: { name: string };
};

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  promotional_price: string;
  category_id: string;
  image_url: string;
  is_active: boolean;
  is_featured: boolean;
  stock: number;
};

export function ProductsManager() {
  const router = useRouter();
  const [products, setProducts] = useState<DeliveryProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        supabase.from('delivery_categories').select('*').order('name'),
        supabase.from('delivery_products').select('*, category:delivery_categories(name)').order('created_at', { ascending: false })
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (productsRes.error) throw productsRes.error;

      setCategories(categoriesRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };



  const handleDelete = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await supabase
        .from('delivery_products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast.success('Produto excluído!');
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  const handleToggleActive = async (product: DeliveryProduct) => {
    try {
      const { error } = await supabase
        .from('delivery_products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;

      setProducts(products.map(p =>
        p.id === product.id ? { ...p, is_active: !p.is_active } : p
      ));
      toast.success(`Produto ${!product.is_active ? 'ativado' : 'desativado'}!`);
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleToggleFeatured = async (product: DeliveryProduct) => {
    try {
      const { error } = await supabase
        .from('delivery_products')
        .update({ is_featured: !product.is_featured })
        .eq('id', product.id);

      if (error) throw error;

      setProducts(products.map(p =>
        p.id === product.id ? { ...p, is_featured: !p.is_featured } : p
      ));
      toast.success(`Destaque ${!product.is_featured ? 'adicionado' : 'removido'}!`);
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Erro ao atualizar destaque');
    }
  };

  const handleEdit = (product: DeliveryProduct) => {
    router.push(`/admin/produtos/editar/${product.id}`);
  };

  const handleDuplicate = (product: DeliveryProduct) => {
    // For now, simpler duplicate just redirects to new page. 
    // In future we can pass ID via query param to prefill.
    // router.push(`/admin/produtos/novo?duplicate=${product.id}`);
    toast('Função de duplicar em manutenção', { icon: '🚧' });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && product.is_active) ||
      (statusFilter === 'inactive' && !product.is_active) ||
      (statusFilter === 'featured' && product.is_featured);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold font-baloo2 text-gray-900 dark:text-white">
            Produtos
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Gerencie o catálogo do delivery
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/produtos/importar"
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:border-orange-500 hover:text-orange-500 transition-colors"
          >
            <FileSpreadsheet size={20} />
            <span className="hidden sm:inline">Importar CSV</span>
          </Link>

          <Link
            href="/admin/produtos/gerenciar"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Package size={20} />
            <span className="hidden sm:inline">Gerenciar em Massa</span>
          </Link>

          <button
            onClick={() => router.push('/admin/produtos/novo')}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Novo Produto
          </button>
        </div>
      </div>

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categories={categories}
      />

      <ProductAdminTable
        products={filteredProducts}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        onToggleFeatured={handleToggleFeatured}
      />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ProductForm } from './products/ProductForm';
import { ProductFilters } from './products/ProductFilters';
import { ProductAdminList } from './products/ProductAdminList';

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
  active: boolean;
  featured: boolean;
  category?: { name: string };
};

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  promotional_price: string;
  category_id: string;
  image_url: string;
  active: boolean;
  featured: boolean;
};

export function ProductsManager() {
  const [products, setProducts] = useState<DeliveryProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DeliveryProduct | null>(null);

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
        supabase.from('delivery_categories').select('*').order('order_index'),
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

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        promotional_price: formData.promotional_price ? parseFloat(formData.promotional_price) : null,
        category_id: formData.category_id,
        image_url: formData.image_url || null,
        active: formData.active,
        featured: formData.featured,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('delivery_products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast.success('Produto atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('delivery_products')
          .insert([productData]);

        if (error) throw error;
        toast.success('Produto criado com sucesso!');
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Erro ao salvar produto');
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
        .update({ active: !product.active })
        .eq('id', product.id);

      if (error) throw error;

      setProducts(products.map(p =>
        p.id === product.id ? { ...p, active: !p.active } : p
      ));
      toast.success(`Produto ${!product.active ? 'ativado' : 'desativado'}!`);
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleToggleFeatured = async (product: DeliveryProduct) => {
    try {
      const { error } = await supabase
        .from('delivery_products')
        .update({ featured: !product.featured })
        .eq('id', product.id);

      if (error) throw error;

      setProducts(products.map(p =>
        p.id === product.id ? { ...p, featured: !p.featured } : p
      ));
      toast.success(`Destaque ${!product.featured ? 'adicionado' : 'removido'}!`);
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Erro ao atualizar destaque');
    }
  };

  const handleEdit = (product: DeliveryProduct) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && product.active) ||
      (statusFilter === 'inactive' && !product.active) ||
      (statusFilter === 'featured' && product.featured);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-baloo2 flex items-center gap-2">
            <Package className="text-orange-500" />
            Gerenciar Produtos
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {products.length} produtos cadastrados
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
        Nenhum produto encontrado com os filtros selecionados.
      </p>
      <button
        onClick={() => {
          setSearchTerm('');
          setSelectedCategory('all');
          setStatusFilter('all');
        }}
        className="mt-4 text-orange-500 hover:text-orange-600 font-bold"
      >
        Limpar Filtros
      </button>
    </LiquidGlass>
  ) : (
    <div className="grid grid-cols-1 gap-4">
      <AnimatePresence>
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.05 }}
          >
            <LiquidGlass className="p-4 hover:scale-[1.01] transition-transform group">
              <div className="flex items-center gap-4">
                {/* Imagem */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🍔
                    </div>
                  )}
                  {product.discount_percentage && product.discount_percentage > 0 && (
                    <div className="absolute top-0 left-0 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br">
                      -{product.discount_percentage}%
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate pr-4">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-green-600 dark:text-green-400">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                    {product.description || 'Sem descrição'}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                      <Package size={12} />
                      {product.stock} {product.unit}
                    </span>
                    <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                      <Tag size={12} />
                      {categories.find(c => c.id === product.category_id)?.name || 'Sem categoria'}
                    </span>
                  </div>
                </div>

                {/* Ações Rápidas */}
                <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-4">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleToggleActive(product)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${product.is_active
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200'
                        }`}
                    >
                      {product.is_active ? 'Ativo' : 'Inativo'}
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(product)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${product.is_featured
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200'
                        }`}
                    >
                      {product.is_featured ? '★ Destaque' : '☆ Destacar'}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 ml-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </LiquidGlass>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
    </div >
  );
}

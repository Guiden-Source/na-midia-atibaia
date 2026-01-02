'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Package, Copy } from 'lucide-react';
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

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        promotional_price: formData.promotional_price ? parseFloat(formData.promotional_price) : null,
        category_id: formData.category_id,
        image_url: formData.image_url || null,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        stock: formData.stock,
      };

      if (editingProduct && editingProduct.id) {
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
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDuplicate = (product: DeliveryProduct) => {
    // Remember last category for future products
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastCategoryId', product.category_id);
    }

    // Pre-fill form with product data (but create new, don't edit)
    setEditingProduct({
      ...product,
      id: '', // Force new creation
      name: `${product.name} (cópia)`,
      is_active: true,
      is_featured: false,
    });
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

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categories={categories}
      />

      <ProductAdminList
        products={filteredProducts}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        onToggleFeatured={handleToggleFeatured}
      />

      {showForm && (
        <ProductForm
          initialData={editingProduct ? {
            name: editingProduct.name,
            description: editingProduct.description,
            price: editingProduct.price.toString(),
            promotional_price: editingProduct.promotional_price?.toString() || '',
            category_id: editingProduct.category_id,
            image_url: editingProduct.image_url || '',
            is_active: editingProduct.is_active,
            is_featured: editingProduct.is_featured,
            stock: editingProduct.stock || 0,
          } : undefined}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!editingProduct}
        />
      )}
    </div>
  );
}

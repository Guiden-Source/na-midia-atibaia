'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DeliveryProduct } from '@/lib/delivery/types';
import { formatPrice } from '@/lib/delivery/cart';
import { Plus, Edit, Trash2, Check, X, Upload, Search, Filter } from 'lucide-react';
import Image from 'next/image';
import { ProductsTableSkeleton } from '@/components/admin/LoadingStates';
import { EmptyProducts } from '@/components/admin/EmptyStates';

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  category_id: string;
  unit: string;
  stock: number;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
  discount_percentage?: number;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

export function ProductsManager() {
  const [products, setProducts] = useState<DeliveryProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DeliveryProduct | null>(null);
  
  // Filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    unit: 'un',
    stock: 0,
    image_url: '',
    is_featured: false,
    is_active: true,
    discount_percentage: 0,
  });

  const supabase = createClient();
  
  // Produtos filtrados
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.is_active) ||
                         (statusFilter === 'inactive' && !product.is_active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    
    // Carregar categorias
    const { data: categoriesData } = await supabase
      .from('delivery_categories')
      .select('*')
      .order('name');
    
    if (categoriesData) {
      setCategories(categoriesData);
    }

    // Carregar produtos
    const { data: productsData } = await supabase
      .from('delivery_products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (productsData) {
      setProducts(productsData);
    }

    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        // Atualizar produto
        const { error } = await supabase
          .from('delivery_products')
          .update(formData)
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        // Criar novo produto
        const { error } = await supabase
          .from('delivery_products')
          .insert([formData]);

        if (error) throw error;
      }

      // Recarregar dados
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Tente novamente.');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Deseja realmente excluir este produto?')) return;

    try {
      const { error } = await supabase
        .from('delivery_products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      await loadData();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto. Tente novamente.');
    }
  };

  const handleToggleActive = async (product: DeliveryProduct) => {
    try {
      const { error } = await supabase
        .from('delivery_products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;

      await loadData();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleEdit = (product: DeliveryProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category_id: product.category_id || '',
      unit: product.unit,
      stock: product.stock,
      image_url: product.image_url || '',
      is_featured: product.is_featured,
      is_active: product.is_active,
      discount_percentage: product.discount_percentage || 0,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category_id: '',
      unit: 'un',
      stock: 0,
      image_url: '',
      is_featured: false,
      is_active: true,
      discount_percentage: 0,
    });
  };

  if (isLoading) {
    return <ProductsTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header com Botão e Estatísticas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Produtos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredProducts.length} de {products.length} produtos
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {showForm ? (
            <>
              <X size={20} />
              <span>Cancelar</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span>Adicionar Produto</span>
            </>
          )}
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por Categoria */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>

        {/* Contador de Filtros Ativos */}
        {(searchTerm || selectedCategory !== 'all' || statusFilter !== 'all') && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter size={16} />
            <span>Filtros ativos:</span>
            {searchTerm && <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">Busca: "{searchTerm}"</span>}
            {selectedCategory !== 'all' && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded">
                {categories.find(c => c.id === selectedCategory)?.name}
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded">
                {statusFilter === 'active' ? 'Ativos' : 'Inativos'}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setStatusFilter('all');
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline ml-2"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Preço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria *
                </label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Unidade *
                </label>
                <select
                  required
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="un">Unidade</option>
                  <option value="kg">Quilograma</option>
                  <option value="g">Grama</option>
                  <option value="l">Litro</option>
                  <option value="ml">Mililitro</option>
                  <option value="cx">Caixa</option>
                  <option value="pct">Pacote</option>
                </select>
              </div>

              {/* Estoque */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estoque *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Desconto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Desconto (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percentage || 0}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* URL da Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL da Imagem
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Produto em Destaque
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Produto Ativo
                </span>
              </label>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                <Check size={20} />
                <span>{editingProduct ? 'Atualizar' : 'Criar'} Produto</span>
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                <X size={20} />
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Produtos */}
      {filteredProducts.length === 0 && products.length === 0 ? (
        <EmptyProducts />
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Nenhum produto encontrado com os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <div className="relative w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xl flex-shrink-0">
                          📦
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </div>
                        {product.is_featured && (
                          <span className="text-xs text-yellow-600 dark:text-yellow-400">
                            ⭐ Destaque
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatPrice(product.price)}
                      {product.discount_percentage && product.discount_percentage > 0 && (
                        <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                          -{product.discount_percentage}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {product.stock} {product.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(product)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        product.is_active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {product.is_active ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
}

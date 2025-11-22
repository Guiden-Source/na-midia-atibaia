'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DeliveryProduct } from '@/lib/delivery/types';
import { formatPrice } from '@/lib/delivery/cart';
import { Plus, Edit, Trash2, Check, X, Upload, Search, Filter, Package, DollarSign, Tag, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { ProductsTableSkeleton } from '@/components/admin/LoadingStates';
import { EmptyProducts } from '@/components/admin/EmptyStates';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

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
        toast.success('Produto atualizado com sucesso!');
      } else {
        // Criar novo produto
        const { error } = await supabase
          .from('delivery_products')
          .insert([formData]);

        if (error) throw error;
        toast.success('Produto criado com sucesso!');
      }

      // Recarregar dados
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error('Erro ao salvar produto. Tente novamente.');
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

      toast.success('Produto excluído com sucesso!');
      await loadData();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto. Tente novamente.');
    }
  };

  const handleToggleActive = async (product: DeliveryProduct) => {
    try {
      const { error } = await supabase
        .from('delivery_products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;

      // Otimistic update
      setProducts(products.map(p =>
        p.id === product.id ? { ...p, is_active: !p.is_active } : p
      ));
      toast.success(`Produto ${!product.is_active ? 'ativado' : 'desativado'}!`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
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

      // Otimistic update
      setProducts(products.map(p =>
        p.id === product.id ? { ...p, is_featured: !p.is_featured } : p
      ));
      toast.success(`Produto ${!product.is_featured ? 'destacado' : 'removido dos destaques'}!`);
    } catch (error) {
      console.error('Erro ao atualizar destaque:', error);
      toast.error('Erro ao atualizar destaque');
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-baloo2">
            Gerenciar Produtos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredProducts.length} de {products.length} produtos cadastrados
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95"
        >
          {showForm ? (
            <>
              <X size={20} />
              <span>Cancelar</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span>Novo Produto</span>
            </>
          )}
        </button>
      </div>

      {/* Filtros e Busca */}
      <LiquidGlass className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Filtro por Categoria */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none"
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
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>
      </LiquidGlass>

      {/* Formulário */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <LiquidGlass className="p-6 mb-6 border-2 border-orange-500/20">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-baloo2 flex items-center gap-2">
                {editingProduct ? <Edit className="text-orange-500" /> : <Plus className="text-orange-500" />}
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coluna 1: Informações Básicas */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Nome do Produto *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                        placeholder="Ex: X-Bacon Especial"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Preço (R$) *
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            required
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Desconto (%)
                        </label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={formData.discount_percentage || ''}
                            onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) || 0 })}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Categoria *
                      </label>
                      <select
                        required
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                      >
                        <option value="">Selecione uma categoria...</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Unidade *
                        </label>
                        <select
                          required
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                          <option value="un">Unidade</option>
                          <option value="kg">Kg</option>
                          <option value="g">Gramas</option>
                          <option value="l">Litros</option>
                          <option value="ml">ml</option>
                          <option value="cx">Caixa</option>
                          <option value="pct">Pacote</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Estoque *
                        </label>
                        <div className="relative">
                          <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            required
                            min="0"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coluna 2: Detalhes e Imagem */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                        URL da Imagem
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          placeholder="https://..."
                          className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                      </div>
                      {/* Image Preview */}
                      <div className="mt-2 relative w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                        {formData.image_url ? (
                          <Image
                            src={formData.image_url}
                            alt="Preview"
                            fill
                            className="object-cover"
                            onError={(e) => {
                              // Fallback se a imagem falhar
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Erro+na+Imagem';
                            }}
                          />
                        ) : (
                          <div className="text-center text-gray-400">
                            <Upload className="mx-auto h-8 w-8 mb-2" />
                            <span className="text-sm">Preview da imagem</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Descrição
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                        placeholder="Descreva os ingredientes e detalhes do produto..."
                      />
                    </div>

                    <div className="flex gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-1">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Produto Ativo
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-1">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                          className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Destaque
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 font-bold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                  </button>
                </div>
              </form>
            </LiquidGlass>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de Produtos */}
      {filteredProducts.length === 0 && products.length === 0 ? (
        <EmptyProducts />
      ) : filteredProducts.length === 0 ? (
        <LiquidGlass className="p-12 text-center">
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
      )}
    </div>
  );
}

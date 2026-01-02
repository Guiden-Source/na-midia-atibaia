'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Package, Upload } from 'lucide-react';
import Link from 'next/link';

export interface ProductFormData {
    name: string;
    description: string;
    price: string;
    promotional_price: string;
    category_id: string;
    image_url: string;
    is_active: boolean;
    is_featured: boolean;
    stock: number;
}

export interface Category {
    id: string;
    name: string;
}

interface ProductFormProps {
    initialData?: ProductFormData;
    categories: Category[];
    onSubmit: (data: ProductFormData) => Promise<void>;
    onCancel?: () => void; // Optional now, usually handled by Link
    isEditing?: boolean;
}

export function ProductForm({
    initialData,
    categories,
    onSubmit,
    isEditing = false,
}: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>(initialData || {
        name: '',
        description: '',
        price: '',
        promotional_price: '',
        category_id: categories[0]?.id || '',
        image_url: '',
        is_active: true,
        is_featured: false,
        stock: 10,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
        // If creating new and no category selected, select first available
        if (!initialData && !formData.category_id && categories.length > 0) {
            setFormData(prev => ({ ...prev, category_id: categories[0].id }));
        }
    }, [initialData, categories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto pb-20">
            {/* Action Bar (Top) */}
            <div className="flex items-center justify-between mb-8">
                <Link
                    href="/admin/produtos"
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Voltar para Produtos</span>
                </Link>
                <div className="flex gap-3">
                    <Link
                        href="/admin/produtos"
                        className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-bold transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Check size={20} />
                                {isEditing ? 'Salvar Alterações' : 'Criar Produto'}
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Left Column) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Package className="text-orange-500" size={20} />
                            Informações Básicas
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Nome do Produto *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="Ex: X-Bacon Supremo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Descrição
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-400 resize-none"
                                    placeholder="Descreva os ingredientes e detalhes do produto..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Preços
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Preço Normal (R$) *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R$</span>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-mono font-bold text-lg"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Preço Promocional
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 font-bold">R$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.promotional_price}
                                        onChange={(e) => setFormData({ ...formData, promotional_price: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-green-600 dark:text-green-400 focus:ring-2 focus:ring-green-500 outline-none transition-all font-mono font-bold text-lg"
                                        placeholder="0.00"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Opcional. Se preenchido, será o preço final.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right Column) */}
                <div className="space-y-6">
                    {/* Image Upload/Preview Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            Imagem do Produto
                        </h3>

                        <div className="aspect-video rounded-xl bg-gray-100 dark:bg-gray-900 mb-4 overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center relative group">
                            {formData.image_url ? (
                                <img
                                    src={formData.image_url}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <Upload className="mx-auto mb-2 opacity-50" />
                                    <span className="text-sm">Sem imagem</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                URL da Imagem
                            </label>
                            <input
                                type="url"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                placeholder="https://..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Recomendamos Imgur ou Supabase Storage.
                            </p>
                        </div>
                    </div>

                    {/* Organization Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Categoria *
                            </label>
                            <select
                                required
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none appearance-none"
                            >
                                <option value="" disabled>Selecione...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                Estoque
                            </label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                    Produto Ativo
                                </span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                    Destaque
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

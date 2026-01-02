'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Star, Eye, EyeOff, Copy, Package } from 'lucide-react';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { formatPrice } from '@/lib/delivery/cart';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    price: number;
    promotional_price?: number;
    image_url?: string;
    category_id: string;
    is_active: boolean;
    is_featured: boolean;
    category?: { name: string };
}

interface ProductAdminListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDuplicate: (product: Product) => void;
    onDelete: (id: string) => void;
    onToggleActive: (product: Product) => void;
    onToggleFeatured: (product: Product) => void;
}

export function ProductAdminList({
    products,
    onEdit,
    onDuplicate,
    onDelete,
    onToggleActive,
    onToggleFeatured,
}: ProductAdminListProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Nenhum produto encontrado
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 ${product.is_active
                            ? 'border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-900/30'
                            : 'border-gray-100 dark:border-gray-700 opacity-60'
                            } shadow-sm hover:shadow-lg transition-all flex flex-col`}
                    >
                        {/* Header: Image & Status */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="relative h-20 w-20 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                        <Package size={24} />
                                    </div>
                                )}
                                {product.is_featured && (
                                    <div className="absolute top-0 right-0 p-1">
                                        <div className="bg-yellow-400 text-white p-1 rounded-bl-lg rounded-tr-sm shadow-sm">
                                            <Star size={10} fill="currentColor" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                {product.is_active ? (
                                    <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">
                                        ATIVO
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 text-xs font-bold">
                                        INATIVO
                                    </span>
                                )}
                                <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-full max-w-[100px] truncate">
                                    {product.category?.name || 'Sem categoria'}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1 line-clamp-2">
                                {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 h-10">
                                {product.description}
                            </p>

                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                                    {formatPrice(product.promotional_price || product.price)}
                                </span>
                                {product.promotional_price && (
                                    <span className="text-gray-400 line-through text-xs">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                            <button
                                onClick={() => onEdit(product)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                                title="Editar produto"
                            >
                                <Edit size={16} />
                                <span className="hidden sm:inline">Editar</span>
                            </button>

                            <button
                                onClick={() => onToggleActive(product)}
                                className={`p-2 rounded-lg transition-colors ${product.is_active
                                    ? 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100'
                                    }`}
                                title={product.is_active ? 'Desativar' : 'Ativar'}
                            >
                                {product.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>

                            <button
                                onClick={() => onToggleFeatured(product)}
                                className={`p-2 rounded-lg transition-colors ${product.is_featured
                                    ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100'
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                title={product.is_featured ? 'Remover destaque' : 'Destacar'}
                            >
                                <Star size={18} className={product.is_featured ? 'fill-current' : ''} />
                            </button>

                            <button
                                onClick={() => onDuplicate(product)}
                                className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                                title="Duplicar"
                            >
                                <Copy size={18} />
                            </button>

                            <button
                                onClick={() => onDelete(product.id)}
                                className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                title="Deletar"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

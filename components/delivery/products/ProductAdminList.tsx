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
    promotional_price?: number;
    image_url?: string;
    category_id: string;
    active: boolean;
    featured: boolean;
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
        <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        <LiquidGlass className="p-4 flex items-center gap-4 group hover:border-orange-500/30 transition-colors">
                            {/* Image */}
                            <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs text-center p-1">
                                        Sem imagem
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">
                                        {product.name}
                                    </h3>
                                    {product.featured && (
                                        <span className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold uppercase">
                                            Destaque
                                        </span>
                                    )}
                                    {!product.is_active && (
                                        <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase">
                                            Inativo
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-1">
                                    {product.description}
                                </p>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-bold text-green-600 dark:text-green-400">
                                        {formatPrice(product.promotional_price || product.price)}
                                    </span>
                                    {product.promotional_price && (
                                        <span className="text-gray-400 line-through text-xs">
                                            {formatPrice(product.price)}
                                        </span>
                                    )}
                                    <span className="text-gray-300 dark:text-gray-600">•</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                                        {product.category?.name || 'Sem categoria'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onToggleFeatured(product)}
                                    className={`p-2 rounded-lg transition-colors ${product.featured
                                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                                        }`}
                                    title={product.featured ? 'Remover destaque' : 'Destacar'}
                                >
                                    <Star size={18} className={product.featured ? 'fill-yellow-600' : ''} />
                                </button>

                                <button
                                    onClick={() => onToggleActive(product)}
                                    className={`p-2 rounded-lg transition-colors ${product.active
                                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                                        }`}
                                    title={product.active ? 'Desativar' : 'Ativar'}
                                >
                                    {product.active ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>

                                <button
                                    onClick={() => onEdit(product)}
                                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                                    title="Editar"
                                >
                                    <Edit size={18} />
                                </button>

                                <button
                                    onClick={() => onDuplicate(product)}
                                    className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 transition-colors"
                                    title="Duplicar produto"
                                >
                                    <Copy size={18} />
                                </button>

                                <button
                                    onClick={() => onDelete(product.id)}
                                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                                    title="Excluir"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </LiquidGlass>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

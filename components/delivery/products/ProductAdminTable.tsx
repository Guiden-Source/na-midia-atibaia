'use client';

import { Edit, Trash2, Star, Eye, EyeOff, Copy, Package, DollarSign, Archive, Tag } from 'lucide-react';
import { formatPrice } from '@/lib/delivery/cart';

interface Product {
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
}

interface ProductAdminTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDuplicate: (product: Product) => void;
    onDelete: (id: string) => void;
    onToggleActive: (product: Product) => void;
    onToggleFeatured: (product: Product) => void;
}

export function ProductAdminTable({
    products,
    onEdit,
    onDuplicate,
    onDelete,
    onToggleActive,
    onToggleFeatured,
}: ProductAdminTableProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <Package size={48} className="mx-auto mb-4 opacity-20" />
                <p>Nenhum produto encontrado</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="p-4 font-bold text-gray-700 dark:text-gray-300 w-16">Img</th>
                            <th className="p-4 font-bold text-gray-700 dark:text-gray-300">Produto</th>
                            <th className="p-4 font-bold text-gray-700 dark:text-gray-300">Categoria</th>
                            <th className="p-4 font-bold text-gray-700 dark:text-gray-300">Preço</th>
                            <th className="p-4 font-bold text-gray-700 dark:text-gray-300 text-center">Estoque</th>
                            <th className="p-4 font-bold text-gray-700 dark:text-gray-300 text-center">Status</th>
                            <th className="p-4 font-bold text-gray-700 dark:text-gray-300 text-center">Destaque</th>
                            <th className="p-4 font-bold text-gray-700 dark:text-gray-300 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                {/* Image */}
                                <td className="p-4">
                                    <div className="relative h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-600">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                <Package size={16} />
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Name & Description */}
                                <td className="p-4 max-w-[200px] sm:max-w-xs">
                                    <div className="font-bold text-gray-900 dark:text-white truncate" title={product.name}>
                                        {product.name}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate" title={product.description}>
                                        {product.description}
                                    </div>
                                </td>

                                {/* Category */}
                                <td className="p-4">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium">
                                        <Tag size={10} />
                                        {product.category?.name || '---'}
                                    </span>
                                </td>

                                {/* Price */}
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        {product.promotional_price ? (
                                            <>
                                                <span className="font-bold text-green-600 dark:text-green-400">
                                                    {formatPrice(product.promotional_price)}
                                                </span>
                                                <span className="text-xs text-gray-400 line-through">
                                                    {formatPrice(product.price)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="font-bold text-gray-700 dark:text-gray-300">
                                                {formatPrice(product.price)}
                                            </span>
                                        )}
                                    </div>
                                </td>

                                {/* Stock */}
                                <td className="p-4 text-center">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${(product.stock || 0) > 0
                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                            : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                        }`}>
                                        {product.stock || 0}
                                    </span>
                                </td>

                                {/* Status Toggle */}
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => onToggleActive(product)}
                                        className={`p-1.5 rounded-lg transition-colors ${product.is_active
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-500'
                                            }`}
                                        title={product.is_active ? 'Desativar' : 'Ativar'}
                                    >
                                        {product.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                </td>

                                {/* Featured Toggle */}
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => onToggleFeatured(product)}
                                        className={`p-1.5 rounded-lg transition-colors ${product.is_featured
                                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-300 dark:text-gray-600'
                                            }`}
                                        title={product.is_featured ? 'Remover Destaque' : 'Destacar'}
                                    >
                                        <Star size={16} className={product.is_featured ? 'fill-current' : ''} />
                                    </button>
                                </td>

                                {/* Actions */}
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-900/30"
                                            title="Editar"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDuplicate(product)}
                                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg dark:text-purple-400 dark:hover:bg-purple-900/30"
                                            title="Duplicar"
                                        >
                                            <Copy size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(product.id)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/30"
                                            title="Excluir"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

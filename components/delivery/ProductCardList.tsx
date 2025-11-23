"use client";

import { DeliveryProduct } from '@/lib/delivery/types';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/delivery/CartContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/delivery/cart';

interface ProductCardListProps {
    product: DeliveryProduct;
}

export function ProductCardList({ product }: ProductCardListProps) {
    const { addItem } = useCart();

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        toast.success(`Adicionado: ${product.name}`, {
            position: 'bottom-center',
            duration: 1500,
            icon: '😋'
        });
    };

    const hasDiscount = product.discount_percentage && product.discount_percentage > 0;
    const originalPrice = hasDiscount ? product.price / (1 - (product.discount_percentage! / 100)) : null;

    return (
        <Link href={`/delivery/produto/${product.id}`} className="block w-full">
            <div className="group bg-white dark:bg-gray-800 p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex gap-4 items-start">

                {/* Content (Left) */}
                <div className="flex-1 min-w-0 flex flex-col h-full justify-between">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {product.name}
                        </h3>
                        {product.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                                {product.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col">
                            {hasDiscount && originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                    {formatPrice(originalPrice)}
                                </span>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-green-600 dark:text-green-400">
                                    {formatPrice(product.price)}
                                </span>
                                {hasDiscount && (
                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        -{product.discount_percentage}%
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image (Right) */}
                <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                            🍽️
                        </div>
                    )}

                    {/* Add Button Overlay */}
                    <button
                        onClick={handleAdd}
                        className="absolute bottom-2 right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors z-10"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </Link>
    );
}

"use client";

import { DeliveryProduct } from '@/lib/delivery/types';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/lib/delivery/CartContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
    product: DeliveryProduct;
}

export function ProductCardModern({ product }: ProductCardProps) {
    const { addItem } = useCart();

    const handleAdd = () => {
        addItem(product);
        toast.success(`Adicionado: ${product.name}`, {
            icon: '😋',
            position: 'bottom-center',
            style: {
                background: '#22c55e',
                color: '#fff',
            },
        });
    };

    return (
        <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 hover:shadow-lg transition-all duration-200 flex md:flex-col gap-4 h-full">
            {/* Image Container */}
            <div className="relative w-28 h-28 md:w-full md:h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 order-2 md:order-1">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                        🍽️
                    </div>
                )}
                {/* Discount Badge (Mock) */}
                {product.original_price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between order-1 md:order-2">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 md:line-clamp-3 mb-2">
                        {product.description}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                        {product.original_price && (
                            <span className="text-xs text-gray-400 line-through">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.original_price)}
                            </span>
                        )}
                        <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </span>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-orange-500 hover:text-white transition-all active:scale-90"
                        aria-label={`Adicionar ${product.name} ao carrinho`}
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

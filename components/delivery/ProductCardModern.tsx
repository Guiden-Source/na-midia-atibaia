"use client";

import { DeliveryProduct } from '@/lib/delivery/types';
import { Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/delivery/CartContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/delivery/cart';

interface ProductCardProps {
    product: DeliveryProduct;
}

export function ProductCardModern({ product }: ProductCardProps) {
    const { addItem } = useCart();

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addItem(product);
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Adicionado ao carrinho!
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {product.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        ), {
            position: 'bottom-center',
            duration: 1500,
            id: `toast-${product.id}` // Prevent duplicates
        });
    };

    const hasDiscount = product.discount_percentage && product.discount_percentage > 0;
    const originalPrice = hasDiscount ? product.price / (1 - (product.discount_percentage! / 100)) : null;

    return (
        <Link href={`/delivery/produto/${product.id}`}>
            <motion.div
                whileHover={{ y: -4 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3 shadow-sm hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-900/30 transition-all duration-300 flex md:flex-col gap-4 h-full overflow-hidden cursor-pointer"
            >
                {/* Image Container */}
                <div className="relative w-28 h-28 md:w-full md:h-48 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 order-2 md:order-1">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                            🍽️
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {hasDiscount && (
                            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm backdrop-blur-md bg-opacity-90">
                                -{product.discount_percentage}% OFF
                            </span>
                        )}
                        {product.is_featured && (
                            <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm backdrop-blur-md bg-opacity-90">
                                ⭐ Destaque
                            </span>
                        )}
                    </div>

                    {/* Stock Badge - Desktop only */}
                    {product.stock < 10 && product.stock > 0 && (
                        <div className="hidden md:block absolute bottom-2 right-2">
                            <span className="bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                Só {product.stock} restantes!
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col order-1 md:order-2 min-w-0">
                    {/* Title & Description */}
                    <div className="flex-1 space-y-1 mb-3">
                        <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {product.name}
                        </h3>
                        {product.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 hidden md:block">
                                {product.description}
                            </p>
                        )}
                    </div>

                    {/* Price Section */}
                    <div className="space-y-1 mb-3">
                        {hasDiscount && originalPrice && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 line-through">
                                    {formatPrice(originalPrice)}
                                </span>
                            </div>
                        )}
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg md:text-xl font-bold text-orange-600 dark:text-orange-400">
                                {formatPrice(product.price)}
                            </span>
                            <span className="text-xs text-gray-500">/un</span>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                        onClick={handleAdd}
                        whileTap={{ scale: 0.95 }}
                        disabled={product.stock === 0}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
                    >
                        {product.stock > 0 ? (
                            <>
                                <Plus size={18} className="group-hover/btn:rotate-90 transition-transform duration-200" />
                                <span className="text-sm">Adicionar</span>
                            </>
                        ) : (
                            <span className="text-sm">Esgotado</span>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </Link>
    );
}


interface ProductCardProps {
    product: DeliveryProduct;
}

export function ProductCardModern({ product }: ProductCardProps) {
    const { addItem } = useCart();

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addItem(product);
        toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <ShoppingBag className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Adicionado ao carrinho!
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {product.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        ), {
            position: 'bottom-center',
            duration: 1500,
            id: `toast-${product.id}` // Prevent duplicates
        });
    };

    const hasDiscount = product.discount_percentage && product.discount_percentage > 0;
    const originalPrice = hasDiscount ? product.price / (1 - (product.discount_percentage! / 100)) : null;

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3 shadow-sm hover:shadow-xl hover:border-orange-200 dark:hover:border-orange-900/30 transition-all duration-300 flex md:flex-col gap-4 h-full overflow-hidden"
        >
            {/* Image Container */}
            <div className="relative w-28 h-28 md:w-full md:h-48 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 order-2 md:order-1">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                        🍽️
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {hasDiscount && (
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm backdrop-blur-md bg-opacity-90">
                            -{product.discount_percentage}% OFF
                        </span>
                    )}
                    {product.is_featured && (
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm backdrop-blur-md bg-opacity-90">
                            ★ Destaque
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between order-1 md:order-2">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-baloo2 font-bold text-gray-900 dark:text-white text-lg leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                            {product.name}
                        </h3>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 md:line-clamp-3 mb-3 leading-relaxed">
                        {product.description}
                    </p>
                </div>

                <div className="flex items-end justify-between mt-auto">
                    <div className="flex flex-col">
                        {hasDiscount && originalPrice && (
                            <span className="text-xs text-gray-400 line-through font-medium">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                        <div className="flex items-baseline gap-1">
                            <span className="font-baloo2 font-bold text-green-600 dark:text-green-400 text-xl">
                                {formatPrice(product.price)}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">
                                /{product.unit}
                            </span>
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAdd}
                        className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 hover:text-white hover:shadow-lg transition-all duration-300"
                        aria-label={`Adicionar ${product.name} ao carrinho`}
                    >
                        <Plus className="h-5 w-5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

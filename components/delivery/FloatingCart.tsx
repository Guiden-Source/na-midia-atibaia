"use client";

import { useState } from 'react';
import { useCart } from '@/lib/delivery/CartContext';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { formatPrice } from '@/lib/delivery/cart';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function FloatingCart() {
    const router = useRouter();
    const { items, total, removeItem, addItem } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    // Calculate subtotal and discount
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const totalDiscount = items.reduce((acc, item) => {
        if (item.discount_percentage) {
            const originalPrice = item.price / (1 - (item.discount_percentage / 100));
            const discount = (originalPrice - item.price) * item.quantity;
            return acc + discount;
        }
        return acc;
    }, 0);

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    const handleRemoveItem = (productId: string) => {
        removeItem(productId);
    };

    const handleIncreaseQuantity = (product: any) => {
        addItem(product);
    };

    const handleDecreaseQuantity = (product: any) => {
        const currentItem = items.find(item => item.id === product.id);
        if (currentItem && currentItem.quantity > 1) {
            // Remove and re-add with correct quantity
            removeItem(product.id);
            for (let i = 0; i < currentItem.quantity - 1; i++) {
                addItem(product);
            }
        }
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-20 md:bottom-4 right-4 z-[100] bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all hover:scale-110 active:scale-95"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                    >
                        {itemCount}
                    </motion.span>
                )}
            </motion.button>

            {/* Slide-over Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-[100] flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-2xl font-bold font-baloo2">Seu Carrinho</h2>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <p className="text-orange-100">
                                    {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                                </p>
                            </div>

                            {/* Items List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {items.map((item) => (
                                    <LiquidGlass key={item.id} className="p-3">
                                        <div className="flex gap-3">
                                            {/* Image */}
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                                {item.image_url ? (
                                                    <Image
                                                        src={item.image_url}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl">
                                                        🍔
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatPrice(item.price)} / {item.unit}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => handleDecreaseQuantity(item)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="font-bold text-sm w-6 text-center text-gray-900 dark:text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleIncreaseQuantity(item)}
                                                        disabled={item.quantity >= item.stock}
                                                        className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="ml-auto p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 dark:text-white">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </LiquidGlass>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 space-y-3 pb-24 md:pb-6">
                                {totalDiscount > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Desconto</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">
                                            -{formatPrice(totalDiscount)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Frete</span>
                                    <span className="font-bold text-green-600 dark:text-green-400">
                                        GRÁTIS 🎉
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-lg font-bold pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-gray-900 dark:text-white font-baloo2">Total</span>
                                    <span className="text-green-600 dark:text-green-400 font-baloo2">
                                        {formatPrice(total)}
                                    </span>
                                </div>

                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/delivery/checkout');
                                    }}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                                >
                                    Finalizar Pedido
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

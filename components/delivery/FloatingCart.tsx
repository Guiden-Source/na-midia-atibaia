"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/delivery/CartContext';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { formatPrice } from '@/lib/delivery/cart';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getCart, removeFromCart, updateCartItemQuantity } from '@/lib/delivery/cart';
import { Cart as CartType } from '@/lib/delivery/types';

export function FloatingCart() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [cart, setCart] = useState<CartType>({ items: [], subtotal: 0, delivery_fee: 0, total: 0 });

    useEffect(() => {
        loadCart();

        const handleCartUpdate = () => loadCart();
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    const loadCart = () => {
        setCart(getCart());
    };

    const handleRemoveItem = (productId: string) => {
        removeFromCart(productId);
        loadCart();
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        updateCartItemQuantity(productId, quantity);
        loadCart();
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const totalDiscount = cart.items.reduce((acc, item) => {
        if (item.product.discount_percentage) {
            const originalPrice = item.product.price / (1 - (item.product.discount_percentage / 100));
            const discount = (originalPrice - item.product.price) * item.quantity;
            return acc + discount;
        }
        return acc;
    }, 0);

    const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    if (cart.items.length === 0) {
        return null;
    }

    return (
        <>
            {/* Floating Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all"
            >
                <div className="relative">
                    <ShoppingCart size={28} />
                    {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                            {itemCount}
                        </span>
                    )}
                </div>
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
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
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
                                {cart.items.map((item) => (
                                    <LiquidGlass key={item.product.id} className="p-3">
                                        <div className="flex gap-3">
                                            {/* Image */}
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                                {item.product.image_url ? (
                                                    <Image
                                                        src={item.product.image_url}
                                                        alt={item.product.name}
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
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatPrice(item.product.price)} / {item.product.unit}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="font-bold text-sm w-6 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.product.stock}
                                                        className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.product.id)}
                                                        className="ml-auto p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900 dark:text-white">
                                                    {formatPrice(item.product.price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </LiquidGlass>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 space-y-3">
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
                                        {formatPrice(cart.subtotal)}
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
                                        {formatPrice(cart.total)}
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

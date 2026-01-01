'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { formatPrice } from '@/lib/delivery/cart';
import { STATUS_CONFIG, Order, OrderStatus } from './types';

interface OrderDetailsModalProps {
    order: Order | null;
    onClose: () => void;
    onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export function OrderDetailsModal({ order, onClose, onUpdateStatus }: OrderDetailsModalProps) {
    if (!order) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                >
                    {/* Modal Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-start bg-gray-50 dark:bg-gray-800/50">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-baloo2">
                                    Pedido #{order.order_number}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.color}`}>
                                    {STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.label}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">
                                {new Date(order.created_at).toLocaleString()}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 overflow-y-auto flex-1 space-y-6">
                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    👤 Cliente
                                </h4>
                                <p className="text-gray-600 dark:text-gray-300">{order.user_name}</p>
                                <p className="text-gray-600 dark:text-gray-300">{order.user_phone}</p>
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                📍 Endereço
                            </h4>
                            <div className="text-gray-600 dark:text-gray-300 space-y-1">
                                <p className="font-medium">
                                    {order.address_street}, {order.address_number}
                                </p>
                                {order.address_complement && (
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {order.address_complement}
                                    </p>
                                )}
                                {order.address_reference && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Ref: {order.address_reference}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            🛍️ Itens do Pedido
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-orange-500">{item.quantity}x</span>
                                        <span className="text-gray-700 dark:text-gray-300">{item.product_name}</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatPrice(item.subtotal)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatPrice(order.total)}
                        </span>
                    </div>
            </div>

            {/* Modal Footer (Actions) */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
                {order.status === 'pending' && (
                    <button
                        onClick={() => onUpdateStatus(order.id, 'preparing')}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-colors shadow-lg"
                    >
                        Aceitar e Preparar
                    </button>
                )}
                {order.status === 'preparing' && (
                    <button
                        onClick={() => onUpdateStatus(order.id, 'delivering')}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors shadow-lg"
                    >
                        Saiu para Entrega
                    </button>
                )}
                {order.status === 'delivering' && (
                    <button
                        onClick={() => onUpdateStatus(order.id, 'completed')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-colors shadow-lg"
                    >
                        Confirmar Entrega
                    </button>
                )}
                {order.status !== 'cancelled' && order.status !== 'completed' && (
                    <button
                        onClick={() => {
                            if (confirm('Cancelar pedido?')) onUpdateStatus(order.id, 'cancelled');
                        }}
                        className="px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </motion.div>
            </div >
        </AnimatePresence >
    );
}

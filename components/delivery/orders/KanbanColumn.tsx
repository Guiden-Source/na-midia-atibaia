'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Truck, ChefHat } from 'lucide-react';
import { formatPrice } from '@/lib/delivery/cart';
import { STATUS_CONFIG, Order, OrderStatus } from './types';

interface KanbanColumnProps {
    status: OrderStatus;
    title: string;
    orders: Order[];
    onSelectOrder: (order: Order) => void;
    onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export function KanbanColumn({ status, title, orders, onSelectOrder, onUpdateStatus }: KanbanColumnProps) {
    const columnOrders = orders.filter(o => o.status === status);
    const Config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
    const Icon = Config?.icon || Clock;

    return (
        <div className="flex-1 min-w-[300px] bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col h-[calc(100vh-200px)]">
            <div className={`flex items-center gap-2 mb-4 px-2 py-1.5 rounded-lg ${Config?.color} w-fit`}>
                <Icon size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wide">{title}</h3>
                <span className="ml-2 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full text-xs font-bold">
                    {columnOrders.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                <AnimatePresence>
                    {columnOrders.map((order) => (
                        <motion.div
                            key={order.id}
                            layoutId={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={() => onSelectOrder(order)}
                            className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md hover:border-orange-500/50 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-mono font-bold text-gray-500 dark:text-gray-400 text-xs">
                                    #{order.order_number}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            {order.scheduled_at && (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1.5 rounded-lg mb-2 w-fit">
                                    <Clock size={12} />
                                    Agendado: {new Date(order.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            )}

                            <h4 className="font-bold text-gray-900 dark:text-white mb-1 truncate">
                                {order.user_name}
                            </h4>

                            <div className="flex items-center justify-between mt-3">
                                <span className="font-bold text-green-600 dark:text-green-400">
                                    {formatPrice(order.total)}
                                </span>

                                {/* Quick Actions */}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {status === 'pending' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'preparing'); }}
                                            className="p-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
                                            title="Mover para Preparo"
                                        >
                                            <ChefHat size={14} />
                                        </button>
                                    )}
                                    {status === 'preparing' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'delivering'); }}
                                            className="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                            title="Mover para Entrega"
                                        >
                                            <Truck size={14} />
                                        </button>
                                    )}
                                    {status === 'delivering' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'completed'); }}
                                            className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                                            title="Concluir Entrega"
                                        >
                                            <CheckCircle size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {columnOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm italic">
                        Sem pedidos aqui
                    </div>
                )}
            </div>
        </div>
    );
}

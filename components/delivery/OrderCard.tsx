"use client";

import { DeliveryOrder, ORDER_STATUS_MAP, OrderStatus } from '@/lib/delivery/types';
import { formatPrice } from '@/lib/delivery/cart';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, HelpCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/delivery/CartContext';
import toast from 'react-hot-toast';

interface OrderCardProps {
    order: DeliveryOrder;
}

export function OrderCard({ order }: OrderCardProps) {
    const { addItem } = useCart();
    const statusInfo = ORDER_STATUS_MAP[order.status as OrderStatus];

    // Get first 3 items for thumbnails
    const thumbnails = order.items?.slice(0, 3).map(item => item.product_image).filter(Boolean) || [];
    const remainingCount = (order.items?.length || 0) - thumbnails.length;

    const handleReorder = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!order.items) return;

        let addedCount = 0;
        order.items.forEach(item => {
            if (item.product) {
                addItem(item.product);
                addedCount++;
            }
        });

        if (addedCount > 0) {
            toast.success(`${addedCount} itens adicionados à sacola!`, {
                icon: '🛍️',
                position: 'bottom-center'
            });
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-4">
            <Link href={`/delivery/pedidos/${order.id}`} className="block p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            {/* Restaurant Logo Placeholder */}
                            <span className="text-lg">🍱</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                                Na Mídia Delivery
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <span>Pedido concluído</span>
                                {order.status === 'completed' && (
                                    <CheckCircle2 size={12} className="text-green-500 fill-green-500 text-white" />
                                )}
                                <span className="mx-1">•</span>
                                <span>Nº {order.order_number}</span>
                            </div>
                        </div>
                    </div>
                    {/* Thumbnails (Desktop) */}
                    <div className="hidden sm:flex -space-x-2">
                        {thumbnails.map((src, i) => (
                            <div key={i} className="relative h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-gray-100">
                                <Image src={src!} alt="" fill className="object-cover" />
                            </div>
                        ))}
                        {remainingCount > 0 && (
                            <div className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                +{remainingCount}
                            </div>
                        )}
                    </div>
                </div>

                {/* Body: Items List */}
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <ul className="space-y-1">
                            {order.items?.map((item) => (
                                <li key={item.id} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-bold min-w-[20px]">{item.quantity}</span>
                                    <span className="line-clamp-1">{item.product_name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Thumbnail (Mobile) */}
                    {thumbnails.length > 0 && (
                        <div className="sm:hidden relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image src={thumbnails[0]!} alt="" fill className="object-cover" />
                        </div>
                    )}
                </div>
            </Link>

            {/* Footer: Actions */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                <Link
                    href="/contato"
                    className="flex-1 py-2.5 px-4 rounded-lg border border-red-500 text-red-500 font-bold text-sm text-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    Ajuda
                </Link>
                <button
                    onClick={handleReorder}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors shadow-sm"
                >
                    Adicionar à sacola
                </button>
            </div>
        </div>
    );
}

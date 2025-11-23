'use client';

import { useEffect, useState } from 'react';
import { getOrderById } from '@/lib/delivery/queries';
import { OrderTracker } from '@/components/delivery/OrderTracker';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { formatPrice } from '@/lib/delivery/cart';
import { ArrowLeft, MessageCircle, MapPin, CreditCard, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DeliveryOrder } from '@/lib/delivery/types';
import { supabase } from '@/lib/supabase';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [order, setOrder] = useState<DeliveryOrder | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadOrder();

        // Subscribe to realtime updates for this order
        const channel = supabase
            .channel(`order-details-${params.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'delivery_orders',
                    filter: `id=eq.${params.id}`,
                },
                (payload) => {
                    console.log('Order updated in realtime:', payload.new);
                    if (payload.new) {
                        setOrder(prev => prev ? { ...prev, ...payload.new } as DeliveryOrder : null);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [params.id]);

    const loadOrder = async () => {
        const data = await getOrderById(params.id);
        if (!data) {
            router.push('/perfil/pedidos');
            return;
        }
        setOrder(data);
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const whatsappLink = `https://wa.me/5511914767026?text=Olá, gostaria de falar sobre o pedido #${order.order_number}`;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 pt-24">
            <div className="container mx-auto px-4 max-w-3xl">

                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/perfil/pedidos"
                        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-bold transition-colors mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span>Voltar aos pedidos</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Package size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-baloo2">
                                Pedido #{order.order_number}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Realizado em {new Date(order.created_at).toLocaleDateString('pt-BR', {
                                    day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tracker */}
                <LiquidGlass className="mb-8 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-baloo2">
                        Status do Pedido
                    </h2>
                    <OrderTracker orderId={order.id} initialStatus={order.status} />
                </LiquidGlass>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Details */}
                    <div className="space-y-6">
                        <LiquidGlass className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-baloo2">
                                Itens do Pedido
                            </h2>
                            <div className="space-y-4">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                            {item.product_image ? (
                                                <Image
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xl">
                                                    🍔
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 break-words leading-tight">
                                                {item.quantity}x {item.product_name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {formatPrice(item.price)} un.
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">
                                                {formatPrice(item.subtotal)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Taxa de Entrega</span>
                                    <span className="text-green-600 dark:text-green-400">GRÁTIS</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <span>Total</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </LiquidGlass>
                    </div>

                    {/* Info & Support */}
                    <div className="space-y-6">
                        <LiquidGlass className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-baloo2">
                                Detalhes da Entrega
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="text-orange-500 mt-1" size={20} />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">Endereço</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {order.address_condominium}<br />
                                            Bloco {order.address_block}, Apto {order.address_apartment}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CreditCard className="text-orange-500 mt-1" size={20} />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">Pagamento</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                            {order.payment_method}
                                            {order.change_for && ` (Troco para ${formatPrice(order.change_for)})`}
                                        </p>
                                    </div>
                                </div>

                                {order.notes && (
                                    <div className="flex items-start gap-3">
                                        <MessageCircle className="text-orange-500 mt-1" size={20} />
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">Observações</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {order.notes}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </LiquidGlass>

                        <div className="space-y-3">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={24} />
                                Falar com Suporte
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

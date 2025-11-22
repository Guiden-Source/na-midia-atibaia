import { getOrderById } from '@/lib/delivery/queries';
import { OrderTracker } from '@/components/delivery/OrderTracker';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { formatPrice } from '@/lib/delivery/cart';
import { ArrowLeft, MessageCircle, MapPin, CreditCard, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const metadata = {
    title: 'Pedido Recebido - Na Mídia Atibaia',
    description: 'Acompanhe o status do seu pedido em tempo real',
};

export default async function OrderSuccessPage({ params }: { params: { id: string } }) {
    const order = await getOrderById(params.id);

    if (!order) {
        notFound();
    }

    const whatsappLink = `https://wa.me/5511914767026?text=Olá, gostaria de falar sobre o pedido #${order.order_number}`;

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 pt-24">
            <div className="container mx-auto px-4 max-w-3xl">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4 animate-bounce">
                        <span className="text-4xl">🎉</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-baloo2 mb-2">
                        Pedido Recebido!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Obrigado, {order.user_name.split(' ')[0]}! Seu pedido <span className="font-bold text-orange-500">#{order.order_number}</span> foi confirmado.
                    </p>
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
                                            <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                                                {item.quantity}x {item.product_name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
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

                            <Link
                                href="/delivery"
                                className="block w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-center py-4 rounded-xl font-bold text-lg hover:border-orange-500 hover:text-orange-500 transition-all"
                            >
                                Voltar para o Início
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

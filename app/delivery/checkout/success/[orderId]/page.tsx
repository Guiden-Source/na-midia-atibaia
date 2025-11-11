import { getOrderById } from '@/lib/delivery/queries';
import { OrderSummary } from '@/components/delivery/OrderSummary';
import { WhatsAppButton } from '@/components/delivery/WhatsAppButton';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Pedido Realizado - Delivery Na Mídia',
  description: 'Seu pedido foi criado com sucesso!',
};

export default async function CheckoutSuccessPage({ params }: { params: { orderId: string } }) {
  const order = await getOrderById(params.orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header de Sucesso */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-8 mb-8 text-center shadow-2xl">
          <div className="flex justify-center mb-4">
            <CheckCircle size={64} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Pedido Criado com Sucesso! 🎉
          </h1>
          <p className="text-xl text-green-100 mb-4">
            Pedido #{order.order_number}
          </p>
          <p className="text-green-100">
            Agora envie pelo WhatsApp para confirmar sua compra
          </p>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <span className="text-2xl">📱</span>
            Próximos Passos
          </h2>
          <ol className="space-y-3 text-blue-800 dark:text-blue-200">
            <li className="flex items-start gap-3">
              <span className="font-bold flex-shrink-0">1.</span>
              <span>Clique no botão verde abaixo para abrir o WhatsApp</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold flex-shrink-0">2.</span>
              <span>A mensagem com seu pedido já estará pronta, basta enviar</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold flex-shrink-0">3.</span>
              <span>Aguarde a confirmação e receba em 30 minutos! 🚀</span>
            </li>
          </ol>
        </div>

        {/* Botão WhatsApp - DESTAQUE PRINCIPAL */}
        <div className="mb-8">
          <WhatsAppButton order={order} size="lg" className="w-full" />
        </div>

        {/* Resumo do Pedido */}
        <OrderSummary order={order} />

        {/* Rastreamento */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Acompanhe o status do seu pedido em tempo real
          </p>
          <Link
            href={`/delivery/pedidos/${order.id}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            📦 Ver Status do Pedido
          </Link>
        </div>

        {/* Voltar */}
        <div className="mt-8 text-center">
          <Link
            href="/delivery"
            className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            ← Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}

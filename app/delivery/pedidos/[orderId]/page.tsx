import { getOrderById } from '@/lib/delivery/queries';
import { OrderSummary } from '@/components/delivery/OrderSummary';
import { OrderTracking } from '@/components/delivery/OrderTracking';
import { WhatsAppButtonCompact } from '@/components/delivery/WhatsAppButton';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export async function generateMetadata({ params }: { params: { orderId: string } }) {
  const order = await getOrderById(params.orderId);
  
  if (!order) {
    return {
      title: 'Pedido não encontrado',
    };
  }

  return {
    title: `Pedido ${order.order_number} - Delivery Na Mídia`,
    description: `Acompanhe seu pedido em tempo real`,
  };
}

export default async function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  const order = await getOrderById(params.orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/delivery"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Voltar para a loja</span>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Pedido {order.order_number}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Realizado em {new Date(order.created_at).toLocaleString('pt-BR')}
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              title="Atualizar status"
            >
              <RefreshCw size={18} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          </div>
        </div>

        {/* Alerta se não enviou WhatsApp ainda */}
        {!order.whatsapp_sent && order.status === 'pending' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                  Pedido ainda não confirmado
                </h3>
                <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                  Para que seu pedido seja processado, você precisa enviá-lo via WhatsApp.
                </p>
                <WhatsAppButtonCompact order={order} />
              </div>
            </div>
          </div>
        )}

        {/* Grid de conteúdo */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Rastreamento */}
          <div>
            <OrderTracking order={order} />
          </div>

          {/* Resumo */}
          <div>
            <OrderSummary order={order} />
          </div>
        </div>

        {/* Ajuda */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Precisa de ajuda?
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Entre em contato
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Se tiver alguma dúvida, fale conosco pelo WhatsApp
                </p>
                <WhatsAppButtonCompact order={order} />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">❓</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Perguntas Frequentes
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Dúvidas sobre entrega e pagamento
                </p>
                <Link
                  href="/faq"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Ver FAQ →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Fazer novo pedido */}
        <div className="mt-8 text-center">
          <Link
            href="/delivery"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🛒 Fazer Novo Pedido
          </Link>
        </div>
      </div>
    </div>
  );
}

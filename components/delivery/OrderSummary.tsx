'use client';

import { DeliveryOrder } from '@/lib/delivery/types';
import { formatPrice } from '@/lib/delivery/cart';
import Image from 'next/image';

interface OrderSummaryProps {
  order: DeliveryOrder;
  showActions?: boolean;
}

export function OrderSummary({ order, showActions = false }: OrderSummaryProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              Pedido {order.order_number}
            </h2>
            <p className="text-blue-100 text-sm">
              {new Date(order.created_at).toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="text-5xl">
            🛒
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6 space-y-6">
        {/* Dados do cliente */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Dados do Cliente
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-gray-500 dark:text-gray-400 min-w-[100px]">Nome:</span>
              <span className="font-medium text-gray-900 dark:text-white">{order.user_name}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-500 dark:text-gray-400 min-w-[100px]">Telefone:</span>
              <span className="font-medium text-gray-900 dark:text-white">{order.user_phone}</span>
            </div>
            {order.user_email && (
              <div className="flex items-start gap-2">
                <span className="text-gray-500 dark:text-gray-400 min-w-[100px]">Email:</span>
                <span className="font-medium text-gray-900 dark:text-white">{order.user_email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Endereço de entrega */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Endereço de Entrega
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-sm">
            <p className="text-gray-900 dark:text-white font-medium">
              {order.address_street}, {order.address_number}
            </p>
            {order.address_complement && (
              <p className="text-gray-600 dark:text-gray-400">{order.address_complement}</p>
            )}
            <p className="text-gray-900 dark:text-white font-medium mt-1">
              {order.address_condominium}
            </p>
            {order.address_block && (
              <p className="text-gray-600 dark:text-gray-400">Bloco {order.address_block}</p>
            )}
            {order.address_apartment && (
              <p className="text-gray-600 dark:text-gray-400">Apartamento {order.address_apartment}</p>
            )}
            {order.address_reference && (
              <p className="text-gray-600 dark:text-gray-400 mt-2 italic">
                Referência: {order.address_reference}
              </p>
            )}
          </div>
        </div>

        {/* Itens do pedido */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Itens do Pedido
          </h3>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                {/* Imagem */}
                {item.product_image ? (
                  <div className="relative w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    📦
                  </div>
                )}

                {/* Detalhes */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {item.product_name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagamento */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Pagamento
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 dark:text-gray-400">Forma de pagamento:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {order.payment_method === 'pix' && '📱 PIX'}
                {order.payment_method === 'dinheiro' && '💵 Dinheiro'}
                {order.payment_method === 'cartao' && '💳 Cartão'}
              </span>
            </div>
            {order.payment_method === 'dinheiro' && order.change_for && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Troco para:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatPrice(order.change_for)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Observações */}
        {order.notes && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Observações
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              {order.notes}
            </p>
          </div>
        )}

        {/* Totais */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatPrice(order.subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Taxa de entrega</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {order.delivery_fee === 0 ? 'GRÁTIS' : formatPrice(order.delivery_fee)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xl font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-green-600 dark:text-green-400">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { DeliveryOrder, ORDER_STATUS_MAP, OrderStatus } from '@/lib/delivery/types';
import { formatPrice } from '@/lib/delivery/cart';
import { updateOrderStatus } from '@/lib/delivery/queries';
import { WhatsAppButtonCompact } from './WhatsAppButton';
import Link from 'next/link';
import { Eye, Package } from 'lucide-react';

interface OrderListProps {
  orders: DeliveryOrder[];
  onStatusChange?: () => void;
}

export function OrderList({ orders, onStatusChange }: OrderListProps) {
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Recarregar página
      if (onStatusChange) {
        onStatusChange();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do pedido');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Nenhum pedido encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const statusInfo = ORDER_STATUS_MAP[order.status];
        const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

        return (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {order.order_number}
                    </h3>
                    <div className={`${statusInfo.bgColor} px-3 py-1 rounded-full flex items-center gap-1`}>
                      <span>{statusInfo.icon}</span>
                      <span className={`text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatPrice(order.total)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                  </div>
                </div>
              </div>

              {/* Cliente */}
              <div className="grid sm:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Cliente</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.user_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.user_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Endereço</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.address_condominium}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.address_street}, {order.address_number}
                    {order.address_block && ` - Bloco ${order.address_block}`}
                    {order.address_apartment && ` Apt ${order.address_apartment}`}
                  </p>
                </div>
              </div>

              {/* Itens */}
              {order.items && order.items.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Itens do pedido:
                  </p>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          • {item.product_name} x{item.quantity}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pagamento */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>Pagamento:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {order.payment_method === 'pix' && '📱 PIX'}
                  {order.payment_method === 'dinheiro' && '💵 Dinheiro'}
                  {order.payment_method === 'cartao' && '💳 Cartão'}
                  {order.payment_method === 'dinheiro' && order.change_for && (
                    <span className="text-gray-500 dark:text-gray-400">
                      {' '}(troco: {formatPrice(order.change_for)})
                    </span>
                  )}
                </span>
              </div>

              {/* Observações */}
              {order.notes && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    Observações:
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">{order.notes}</p>
                </div>
              )}

              {/* Ações */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                {/* Atualizar status */}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  disabled={updatingOrderId === order.id}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                >
                  <option value="pending">⏳ Aguardando</option>
                  <option value="confirmed">✅ Confirmado</option>
                  <option value="preparing">📦 Preparando</option>
                  <option value="delivering">🚚 Saiu para entrega</option>
                  <option value="completed">🎉 Entregue</option>
                  <option value="cancelled">❌ Cancelado</option>
                </select>

                {/* Ver detalhes */}
                <Link
                  href={`/delivery/pedidos/${order.id}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                  title="Ver detalhes"
                >
                  <Eye size={18} />
                  <span className="hidden sm:inline">Detalhes</span>
                </Link>

                {/* WhatsApp */}
                <div className="flex items-center">
                  <WhatsAppButtonCompact order={order} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

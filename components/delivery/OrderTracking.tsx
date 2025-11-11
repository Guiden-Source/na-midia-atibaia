'use client';

import { DeliveryOrder, ORDER_STATUS_MAP } from '@/lib/delivery/types';

interface OrderTrackingProps {
  order: DeliveryOrder;
}

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'delivering', 'completed'] as const;

export function OrderTracking({ order }: OrderTrackingProps) {
  const currentStatusIndex = STATUS_FLOW.indexOf(order.status as any);
  const isCancelled = order.status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-red-500">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Pedido Cancelado
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Este pedido foi cancelado.
          </p>
          {order.cancelled_at && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Cancelado em: {new Date(order.cancelled_at).toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Status do Pedido
      </h3>

      {/* Status atual em destaque */}
      <div className={`${ORDER_STATUS_MAP[order.status].bgColor} rounded-lg p-4 mb-6`}>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{ORDER_STATUS_MAP[order.status].icon}</span>
          <div>
            <div className={`text-xl font-bold ${ORDER_STATUS_MAP[order.status].color}`}>
              {ORDER_STATUS_MAP[order.status].label}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {ORDER_STATUS_MAP[order.status].description}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline de status */}
      <div className="space-y-4">
        {STATUS_FLOW.map((status, index) => {
          const statusInfo = ORDER_STATUS_MAP[status];
          const isCompleted = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;

          return (
            <div key={status} className="flex items-start gap-4">
              {/* Linha vertical */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-green-200 dark:ring-green-900' : ''}`}
                >
                  {statusInfo.icon}
                </div>
                {index < STATUS_FLOW.length - 1 && (
                  <div
                    className={`w-0.5 h-12 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 pb-8">
                <div
                  className={`font-semibold ${
                    isCompleted
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {statusInfo.label}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {statusInfo.description}
                </div>
                
                {/* Timestamp */}
                {status === 'confirmed' && order.confirmed_at && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {new Date(order.confirmed_at).toLocaleString('pt-BR')}
                  </div>
                )}
                {status === 'completed' && order.delivered_at && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {new Date(order.delivered_at).toLocaleString('pt-BR')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Estimativa de entrega */}
      {currentStatusIndex >= 0 && currentStatusIndex < STATUS_FLOW.length - 1 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <span className="text-2xl">⏱️</span>
            <div>
              <div className="font-semibold">Previsão de entrega</div>
              <div className="text-sm">30 minutos a partir da confirmação</div>
            </div>
          </div>
        </div>
      )}

      {/* Pedido entregue */}
      {order.status === 'completed' && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <span className="text-2xl">🎉</span>
            <div>
              <div className="font-semibold">Pedido entregue com sucesso!</div>
              <div className="text-sm">Obrigado por comprar conosco!</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

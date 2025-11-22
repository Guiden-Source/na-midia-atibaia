'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Truck, ChefHat, AlertCircle, Search, Filter, X } from 'lucide-react';
import { formatPrice } from '@/lib/delivery/cart';
import toast from 'react-hot-toast';

type OrderStatus = 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';

type Order = {
  id: string;
  order_number: string;
  user_name: string;
  user_phone: string;
  total: number;
  status: OrderStatus;
  payment_method: string;
  created_at: string;
  address_street: string;
  address_number: string;
  address_complement?: string;
  items: any[]; // JSONB
};

const STATUS_CONFIG = {
  pending: {
    label: 'Recebido',
    icon: AlertCircle,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
  preparing: {
    label: 'Em Preparo',
    icon: ChefHat,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    borderColor: 'border-orange-200 dark:border-orange-800',
  },
  delivering: {
    label: 'Em Entrega',
    icon: Truck,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  completed: {
    label: 'Entregue',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800',
  },
};

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadOrders();

    // Realtime subscription - only reload on new orders (INSERT)
    const channel = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'delivery_orders' },
        (payload) => {
          console.log('New order received!', payload);
          loadOrders();
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'delivery_orders' },
        (payload) => {
          console.log('Order updated!', payload);
          // Update specific order in state instead of reloading all
          const updatedOrder = payload.new as Order;
          setOrders(prevOrders =>
            prevOrders.map(o => o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o)
          );
          if (selectedOrder?.id === updatedOrder.id) {
            setSelectedOrder(prev => prev ? { ...prev, ...updatedOrder } : null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from('delivery_orders')
      .select(`
        *,
        items:delivery_order_items(
          *,
          product:delivery_products(*)
        )
      `)
      .order('created_at', { ascending: false }); // Most recent first

    if (error) {
      console.error('Error loading orders:', error);
      toast.error('Erro ao carregar pedidos');
    } else {
      setOrders(data as Order[]);
    }
    setIsLoading(false);
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const { error } = await supabase
      .from('delivery_orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating status:', error);
      toast.error('Erro ao atualizar status');
    } else {
      toast.success(`Status atualizado para ${STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG]?.label || newStatus}`);

      // Update local state immediately
      setOrders(prevOrders =>
        prevOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }

      // Reload to ensure sync (optional but safer)
      // loadOrders();
    }
  };

  const KanbanColumn = ({ status, title }: { status: OrderStatus, title: string }) => {
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
                onClick={() => setSelectedOrder(order)}
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
                        onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'preparing'); }}
                        className="p-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
                        title="Mover para Preparo"
                      >
                        <ChefHat size={14} />
                      </button>
                    )}
                    {status === 'preparing' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'delivering'); }}
                        className="p-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        title="Mover para Entrega"
                      >
                        <Truck size={14} />
                      </button>
                    )}
                    {status === 'delivering' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'completed'); }}
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
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-baloo2">
          Gerenciamento de Pedidos
        </h2>
        <div className="flex gap-2">
          <button
            onClick={loadOrders}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Clock size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max px-1">
            <KanbanColumn status="pending" title="Recebidos" />
            <KanbanColumn status="preparing" title="Em Preparo" />
            <KanbanColumn status="delivering" title="Saiu p/ Entrega" />
            <KanbanColumn status="completed" title="Concluídos" />
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedOrder(null)}>
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
                      Pedido #{selectedOrder.order_number}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_CONFIG[selectedOrder.status as keyof typeof STATUS_CONFIG]?.color}`}>
                      {STATUS_CONFIG[selectedOrder.status as keyof typeof STATUS_CONFIG]?.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
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
                    <p className="text-gray-600 dark:text-gray-300">{selectedOrder.user_name}</p>
                    <p className="text-gray-600 dark:text-gray-300">{selectedOrder.user_phone}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      📍 Endereço
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedOrder.address_street}, {selectedOrder.address_number}
                    </p>
                    {selectedOrder.address_complement && (
                      <p className="text-sm text-gray-500">{selectedOrder.address_complement}</p>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    🛍️ Itens do Pedido
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
                    {selectedOrder.items?.map((item: any, idx: number) => (
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
                    {formatPrice(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Modal Footer (Actions) */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(selectedOrder.id, 'preparing')}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition-colors shadow-lg"
                  >
                    Aceitar e Preparar
                  </button>
                )}
                {selectedOrder.status === 'preparing' && (
                  <button
                    onClick={() => updateStatus(selectedOrder.id, 'delivering')}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors shadow-lg"
                  >
                    Saiu para Entrega
                  </button>
                )}
                {selectedOrder.status === 'delivering' && (
                  <button
                    onClick={() => updateStatus(selectedOrder.id, 'completed')}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-colors shadow-lg"
                  >
                    Confirmar Entrega
                  </button>
                )}
                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                  <button
                    onClick={() => {
                      if (confirm('Cancelar pedido?')) updateStatus(selectedOrder.id, 'cancelled');
                    }}
                    className="px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

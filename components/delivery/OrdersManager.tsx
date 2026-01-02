'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Clock, Search, LayoutDashboard, History, Smartphone, Calculator, AlertCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { Order, OrderStatus, STATUS_CONFIG } from './orders/types';
import { KanbanColumn } from './orders/KanbanColumn';
import { OrderDetailsModal } from './orders/OrderDetailsModal';

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
          // Optimize: Insert directly into state
          const newOrder = payload.new as Order;
          // We ideally need the items too, but for Kanban card basic info (Order #, Name, Total) is enough.
          // However, if we need relations, we might still need to fetch. 
          // For now, let's just trigger loadOrders to be safe about relations (items), 
          // BUT if we wanted to be super fast we'd fetch just this one ID.
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
    // Find the order to update
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (!orderToUpdate) {
      toast.error('Pedido não encontrado');
      return;
    }

    // Show loading state on the specific order
    setOrders(prevOrders =>
      prevOrders.map(o => o.id === orderId ? { ...o, isUpdating: true } as any : o)
    );

    try {
      console.log(`Updating order ${orderId} from ${orderToUpdate.status} to ${newStatus}`);

      // Perform the update
      const { data, error } = await supabase
        .from('delivery_orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating status:', error);
        throw error;
      }

      console.log('Update successful:', data);

      // Success feedback
      toast.success(`Status atualizado para ${STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG]?.label || newStatus}`);

      // The realtime subscription will handle the state update
      // But we clear the loading state immediately
      setOrders(prevOrders =>
        prevOrders.map(o => {
          if (o.id === orderId) {
            const { isUpdating, ...rest } = o as any;
            return { ...rest, status: newStatus };
          }
          return o;
        })
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }

    } catch (error: any) {
      console.error('Failed to update status:', error);
      toast.error(error.message || 'Erro ao atualizar status');

      // Revert loading state on error
      setOrders(prevOrders =>
        prevOrders.map(o => {
          if (o.id === orderId) {
            const { isUpdating, ...rest } = o as any;
            return rest;
          }
          return o;
        })
      );
    }
  };



  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order.user_name?.toLowerCase().includes(searchLower) ||
      order.order_number?.toLowerCase().includes(searchLower) ||
      order.id?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-baloo2">
          Gerenciamento de Pedidos
        </h2>
        <div className="flex gap-4 min-w-[300px] flex-1">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome ou Nº..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
          </div>
          <button
            onClick={loadOrders}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Atualizar Lista"
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
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tabs Control */}
          <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex items-center gap-2 px-4 py-2 font-bold rounded-t-lg transition-all ${activeTab === 'active'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50 dark:bg-orange-900/10'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
            >
              <LayoutDashboard size={18} />
              Quadro Ativo
              <span className="bg-orange-100 text-orange-700 text-xs px-2 rounded-full">
                {orders.filter(o => ['pending', 'preparing', 'delivering'].includes(o.status)).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 font-bold rounded-t-lg transition-all ${activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/10'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
            >
              <History size={18} />
              Histórico
              <span className="bg-gray-100 text-gray-700 text-xs px-2 rounded-full">
                {orders.filter(o => ['completed', 'cancelled'].includes(o.status)).length}
              </span>
            </button>
          </div>

          {activeTab === 'active' ? (
            /* ACTIVE BOARD (KANBAN) */
            <div className="flex-1 overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max px-1 h-full">
                <KanbanColumn
                  status="pending"
                  title="Recebidos"
                  orders={filteredOrders}
                  onSelectOrder={setSelectedOrder}
                  onUpdateStatus={updateStatus}
                />
                <KanbanColumn
                  status="preparing"
                  title="Em Preparo"
                  orders={filteredOrders}
                  onSelectOrder={setSelectedOrder}
                  onUpdateStatus={updateStatus}
                />
                <KanbanColumn
                  status="delivering"
                  title="Saiu p/ Entrega"
                  orders={filteredOrders}
                  onSelectOrder={setSelectedOrder}
                  onUpdateStatus={updateStatus}
                />
              </div>
            </div>
          ) : (
            /* HISTORY LIST (TABLE) */
            <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0 z-10 w-full">
                  <tr>
                    <th className="p-4 font-bold text-gray-700 dark:text-gray-300">Nº Pedido</th>
                    <th className="p-4 font-bold text-gray-700 dark:text-gray-300">Cliente</th>
                    <th className="p-4 font-bold text-gray-700 dark:text-gray-300">Data</th>
                    <th className="p-4 font-bold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="p-4 font-bold text-gray-700 dark:text-gray-300">Total</th>
                    <th className="p-4 font-bold text-gray-700 dark:text-gray-300 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredOrders
                    .filter(o => ['completed', 'cancelled'].includes(o.status))
                    .map((order) => {
                      const StatusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
                      const StatusIcon = StatusConfig?.icon || AlertCircle;
                      return (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                        >
                          <td className="p-4 font-mono font-bold text-gray-600 dark:text-gray-400">
                            #{order.order_number}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-gray-900 dark:text-white">{order.user_name}</div>
                            <div className="text-xs text-gray-500">{order.user_phone}</div>
                          </td>
                          <td className="p-4 text-gray-500">
                            {new Date(order.created_at).toLocaleString('pt-BR')}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${StatusConfig?.color}`}>
                              <StatusIcon size={14} />
                              {StatusConfig?.label || order.status}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-green-600 dark:text-green-400">
                            {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                              className="text-gray-400 hover:text-orange-500 transition-colors"
                            >
                              <Eye size={20} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  {filteredOrders.filter(o => ['completed', 'cancelled'].includes(o.status)).length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                        Nenhum pedido no histórico
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>)}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={updateStatus}
      />
    </div>
  );
}

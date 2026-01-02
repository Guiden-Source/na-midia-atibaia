'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Clock, Search, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Order, OrderStatus, STATUS_CONFIG } from './orders/types';
import { KanbanColumn } from './orders/KanbanColumn';
import { OrderDetailsModal } from './orders/OrderDetailsModal';

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
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
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max px-1">
          <KanbanColumn
            status="pending"
            title="Recebidos"
            orders={filteredOrders}
            onSelectOrder={setSelectedOrder}
            onUpdateStatus={updateStatus}
          />
          <KanbanColumn
            status="confirmed"
            title="Confirmados"
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
          <KanbanColumn
            status="completed"
            title="Concluídos"
            orders={filteredOrders}
            onSelectOrder={setSelectedOrder}
            onUpdateStatus={updateStatus}
          />
          {/* New Cancelled Column */}
          <KanbanColumn
            status="cancelled"
            title="Cancelados"
            orders={filteredOrders}
            onSelectOrder={setSelectedOrder}
            onUpdateStatus={updateStatus}
          />
        </div>
      </div>
    )}

    {/* Order Details Modal */}
    <OrderDetailsModal
      order={selectedOrder}
      onClose={() => setSelectedOrder(null)}
      onUpdateStatus={updateStatus}
    />
  </div>
);
}

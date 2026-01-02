'use client';

import { OrdersManager } from '@/components/delivery/OrdersManager';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminOrdersPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 h-[calc(100vh-80px)] flex flex-col">
      <AdminHeader
        title="Gerenciar Pedidos"
        description="Gerencie todos os pedidos de delivery em tempo real"
      />

      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        <OrdersManager />
      </div>
    </div>
  );
}



return (
  <div className="p-4 sm:p-6 space-y-6 h-[calc(100vh-80px)] flex flex-col">
    <AdminHeader
      title="Gerenciar Pedidos"
      description="Gerencie todos os pedidos de delivery em tempo real"
    />



    {/* Kanban Board */}
    <div className="flex-1 min-h-0">
      <OrdersManager />
    </div>
  </div>
);
}

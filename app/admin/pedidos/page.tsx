import { getAllOrders, getOrderStats } from '@/lib/delivery/queries';
import { OrderList } from '@/components/delivery/OrderList';
import { formatPrice } from '@/lib/delivery/cart';
import Link from 'next/link';
import { Package, Clock, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';

export const metadata = {
  title: 'Admin - Pedidos Delivery - Na Mídia',
  description: 'Gerenciar pedidos de delivery',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  searchParams: { status?: string };
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const statusFilter = searchParams.status;
  
  const [orders, stats] = await Promise.all([
    getAllOrders(statusFilter),
    getOrderStats(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                📦 Gerenciar Pedidos Delivery
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie todos os pedidos de delivery em tempo real
              </p>
            </div>

            <Link
              href="/delivery"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Ver Loja
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalOrders}
                </p>
              </div>
              <Package className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.pendingOrders}
                </p>
              </div>
              <Clock className="text-yellow-600" size={32} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Em Andamento</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.activeOrders}
                </p>
              </div>
              <TrendingUp className="text-orange-600" size={32} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hoje</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.todayOrders}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Faturamento</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
              <DollarSign className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Filtrar por Status
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/pedidos"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !statusFilter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Todos ({stats.totalOrders})
            </Link>
            <Link
              href="/admin/pedidos?status=pending"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              ⏳ Pendentes ({stats.pendingOrders})
            </Link>
            <Link
              href="/admin/pedidos?status=confirmed"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'confirmed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              ✅ Confirmados
            </Link>
            <Link
              href="/admin/pedidos?status=preparing"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'preparing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              📦 Preparando
            </Link>
            <Link
              href="/admin/pedidos?status=delivering"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'delivering'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              🚚 Em Entrega
            </Link>
            <Link
              href="/admin/pedidos?status=completed"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              🎉 Entregues
            </Link>
            <Link
              href="/admin/pedidos?status=cancelled"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'cancelled'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              ❌ Cancelados
            </Link>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <OrderList orders={orders} />
      </div>
    </div>
  );
}

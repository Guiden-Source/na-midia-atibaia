"use client";

import { AdminHeader } from '@/components/admin/AdminHeader';
import { QuickStats } from '@/components/admin/dashboard/QuickStats';
import { SalesChart } from '@/components/admin/dashboard/SalesChart';
import { TopProducts } from '@/components/admin/dashboard/TopProducts';
import { HealthIndicator } from '@/components/admin/dashboard/HealthIndicator';
import { LiquidGlass } from '@/components/ui/liquid-glass';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AdminHeader
        title="Dashboard"
        description="Visão completa do delivery"
      />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Quick Stats */}
        <QuickStats />

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart - 2/3 width */}
          <div className="lg:col-span-2">
            <LiquidGlass className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                📈 Vendas (Últimos 7 Dias)
              </h3>
              <SalesChart />
            </LiquidGlass>
          </div>

          {/* Health Status - 1/3 width */}
          <div>
            <LiquidGlass className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                🏥 Status do Sistema
              </h3>
              <HealthIndicator />
            </LiquidGlass>
          </div>
        </div>

        {/* Top Products */}
        <LiquidGlass className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            🏆 Top 5 Produtos Mais Vendidos
          </h3>
          <TopProducts />
        </LiquidGlass>
      </div>
    </div>
  );
}

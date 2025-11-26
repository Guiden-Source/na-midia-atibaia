"use client";

import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAdminStats } from '@/hooks/useAdminStats';
import { StatsGrid } from '@/components/admin/dashboard/StatsGrid';
import { QuickLinks } from '@/components/admin/dashboard/QuickLinks';
import { RecentActivity } from '@/components/admin/dashboard/RecentActivity';

export default function AdminDashboard() {
  const { stats, recentOrders, loading } = useAdminStats();

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <AdminHeader
        title="Dashboard"
        description="Visão geral do sistema"
      />

      <StatsGrid stats={stats} />
      <QuickLinks stats={stats} />
      <RecentActivity orders={recentOrders} stats={stats} />
    </div>
  );
}

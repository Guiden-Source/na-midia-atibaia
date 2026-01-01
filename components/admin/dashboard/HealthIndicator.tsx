'use client';

import { Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { useHealthStatus } from '@/hooks/useDashboardMetrics';

export function HealthIndicator() {
    const { data, loading } = useHealthStatus();

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    const statusConfig = {
        healthy: {
            icon: CheckCircle,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-200 dark:border-green-800',
            label: 'HEALTHY',
        },
        warning: {
            icon: AlertCircle,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-200 dark:border-yellow-800',
            label: 'WARNING',
        },
        error: {
            icon: AlertCircle,
            color: 'text-red-500',
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-800',
            label: 'ERROR',
        },
    };

    const config = statusConfig[data.status];
    const Icon = config.icon;

    return (
        <div className={`p-4 rounded-xl border-2 ${config.bg} ${config.border}`}>
            <div className="flex items-center gap-3 mb-3">
                <Icon className={config.color} size={24} />
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        System Health
                        <span className={`px-2 py-0.5 rounded-full text-xs ${config.color} ${config.bg}`}>
                            {config.label}
                        </span>
                    </h3>
                </div>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Database</span>
                    <span className={data.database ? 'text-green-600' : 'text-red-600'}>
                        {data.database ? '✓ OK' : '✗ Error'}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Pending Orders</span>
                    <span className={data.pendingOrders > 5 ? 'text-yellow-600' : 'text-gray-600'}>
                        {data.pendingOrders}
                    </span>
                </div>

                {data.issues.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Issues:</p>
                        {data.issues.map((issue, i) => (
                            <p key={i} className="text-xs text-gray-500 dark:text-gray-400">
                                • {issue}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { Trophy, TrendingUp } from 'lucide-react';
import { useTopProducts } from '@/hooks/useDashboardMetrics';

export function TopProducts() {
    const { data, loading } = useTopProducts();

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-500">
                Nenhum produto vendido ainda
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {data.map((product, index) => (
                <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {/* Ranking */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-200 text-gray-700' :
                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                    'bg-gray-100 text-gray-600'
                        }`}>
                        {index + 1}
                    </div>

                    {/* Trophy for #1 */}
                    {index === 0 && (
                        <Trophy className="text-yellow-500" size={20} />
                    )}

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                            {product.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {product.sales} vendas
                        </p>
                    </div>

                    {/* Trend Icon */}
                    <TrendingUp className="text-green-500" size={18} />
                </div>
            ))}
        </div>
    );
}

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useWeeklySales } from '@/hooks/useDashboardMetrics';

export function SalesChart() {
    const { data, loading } = useWeeklySales();

    if (loading) {
        return (
            <div className="h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center text-gray-500">
                Nenhuma venda nos últimos 7 dias
            </div>
        );
    }

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        fontSize={12}
                    />
                    <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                        }}
                        formatter={(value: number, name: string) => {
                            if (name === 'revenue') {
                                return [`R$ ${value.toFixed(2)}`, 'Receita'];
                            }
                            return [value, 'Pedidos'];
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#f97316"
                        strokeWidth={3}
                        dot={{ fill: '#f97316', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981', r: 3 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

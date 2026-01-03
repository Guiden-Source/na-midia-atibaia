'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { OrderCard } from './OrderCard';
import { DeliveryOrder } from '@/lib/delivery/types';

interface OrdersRealtimeProviderProps {
    initialOrders: DeliveryOrder[];
    userId: string;
    userPhone?: string;
}

export function OrdersRealtimeProvider({
    initialOrders,
    userId,
    userPhone
}: OrdersRealtimeProviderProps) {
    const [orders, setOrders] = useState<DeliveryOrder[]>(initialOrders);
    const supabase = createClient();

    useEffect(() => {
        // Subscribe to order changes for this user
        const channel = supabase
            .channel('user_orders_realtime')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'delivery_orders',
            }, (payload) => {
                const updatedOrder = payload.new as DeliveryOrder;

                // Only update if this order belongs to current user
                const belongsToUser = updatedOrder.user_id === userId ||
                    (userPhone && updatedOrder.user_phone === userPhone);

                if (belongsToUser) {
                    setOrders((prevOrders) =>
                        prevOrders.map(order =>
                            order.id === updatedOrder.id
                                ? { ...order, ...updatedOrder }
                                : order
                        )
                    );
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, userPhone]);

    // Group orders by date (same logic as parent component)
    const groupedOrders = orders.reduce((groups: Record<string, DeliveryOrder[]>, order) => {
        const date = new Date(order.created_at);
        const dateKey = date.toLocaleDateString('pt-BR', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(order);
        return groups;
    }, {});

    return (
        <div className="space-y-8">
            {Object.entries(groupedOrders).map(([date, groupOrders]) => (
                <div key={date}>
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 pl-1">
                        {date}
                    </h3>
                    <div className="space-y-4">
                        {groupOrders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

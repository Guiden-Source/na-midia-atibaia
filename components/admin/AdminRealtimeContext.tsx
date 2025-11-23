"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { DeliveryOrder } from '@/lib/delivery/types';

interface AdminRealtimeContextType {
    isConnected: boolean;
    lastOrder: DeliveryOrder | null;
}

const AdminRealtimeContext = createContext<AdminRealtimeContextType | undefined>(undefined);

export function AdminRealtimeProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);
    const [lastOrder, setLastOrder] = useState<DeliveryOrder | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const channel = supabase
            .channel('admin-dashboard')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'delivery_orders'
                },
                (payload) => {
                    const newOrder = payload.new as DeliveryOrder;
                    setLastOrder(newOrder);

                    // Play Sound
                    const audio = new Audio('/sounds/notification.mp3');
                    audio.play().catch(e => console.log('Audio play failed', e));

                    // Show Toast
                    toast.success(`Novo pedido #${newOrder.order_number}!`, {
                        duration: 10000,
                        icon: '🔔',
                        style: {
                            border: '1px solid #22c55e',
                            padding: '16px',
                            color: '#15803d',
                        },
                    });
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    setIsConnected(true);
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    return (
        <AdminRealtimeContext.Provider value={{ isConnected, lastOrder }}>
            {children}
        </AdminRealtimeContext.Provider>
    );
}

export function useAdminRealtime() {
    const context = useContext(AdminRealtimeContext);
    if (context === undefined) {
        throw new Error('useAdminRealtime must be used within an AdminRealtimeProvider');
    }
    return context;
}

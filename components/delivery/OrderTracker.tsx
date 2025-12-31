"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, ChefHat, Truck, Package } from 'lucide-react';
import { OrderStatus, ORDER_STATUS_MAP } from '@/lib/delivery/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { getOrderStatus } from '@/app/delivery/actions';

const STATUS_COLORS = {
    pending: { bg: '#f97316', color: 'orange' },      // laranja
    confirmed: { bg: '#3b82f6', color: 'blue' },      // azul  
    preparing: { bg: '#a855f7', color: 'purple' },    // roxo
    delivering: { bg: '#22c55e', color: 'green' },    // verde
    completed: { bg: '#059669', color: 'emerald' },   // verde escuro
};

interface OrderTrackerProps {
    orderId: string;
    initialStatus: OrderStatus;
}

const STEPS = [
    { status: 'pending', icon: Clock, label: 'Recebido' },
    { status: 'confirmed', icon: Check, label: 'Confirmado' },
    { status: 'preparing', icon: ChefHat, label: 'Preparando' },
    { status: 'delivering', icon: Truck, label: 'Saiu para Entrega' },
    { status: 'completed', icon: Package, label: 'Entregue' },
] as const;

export function OrderTracker({ orderId, initialStatus }: OrderTrackerProps) {
    const [status, setStatus] = useState<OrderStatus>(initialStatus);

    // ...

    useEffect(() => {
        // Subscribe to realtime updates
        const channel = supabase
            .channel(`order-${orderId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'delivery_orders',
                    filter: `id=eq.${orderId}`,
                },
                (payload) => {
                    if (payload.new && payload.new.status) {
                        setStatus(payload.new.status as OrderStatus);
                    }
                }
            )
            .subscribe();

        // Polling fallback (every 5 seconds)
        const interval = setInterval(async () => {
            const newStatus = await getOrderStatus(orderId);
            if (newStatus && newStatus !== status) {
                setStatus(newStatus);
            }
        }, 5000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(interval);
        };
    }, [orderId, status]);

    const getCurrentStepIndex = () => {
        if (status === 'cancelled') return -1;
        return STEPS.findIndex(s => s.status === status);
    };

    const currentStepIndex = getCurrentStepIndex();

    if (status === 'cancelled') {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                    Pedido Cancelado
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Seu pedido foi cancelado. Entre em contato conosco para mais informações.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-3">
            {STEPS.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;
                const stepColor = STATUS_COLORS[step.status as keyof typeof STATUS_COLORS];

                return (
                    <motion.div
                        key={step.status}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
                            isCurrent 
                                ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-500 shadow-lg shadow-green-500/20"
                                : isActive
                                ? "bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-300 dark:border-gray-700"
                                : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 opacity-60"
                        )}
                    >
                        {/* Icon */}
                        <motion.div
                            animate={{
                                scale: isCurrent ? 1.1 : 1,
                            }}
                            style={{ 
                                backgroundColor: isActive ? (stepColor?.bg || '#22c55e') : '#e5e7eb' 
                            }}
                            className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                                isActive ? "text-white shadow-md" : "text-gray-400 dark:bg-gray-800"
                            )}
                        >
                            <Icon size={24} />
                        </motion.div>

                        {/* Label + Status */}
                        <div className="flex-1 min-w-0">
                            <p className={cn(
                                "font-bold text-base transition-colors duration-300",
                                isCurrent 
                                    ? "text-green-700 dark:text-green-400"
                                    : isActive
                                    ? "text-gray-700 dark:text-gray-300"
                                    : "text-gray-400 dark:text-gray-600"
                            )}>
                                {step.label}
                            </p>
                            {isCurrent && ORDER_STATUS_MAP[status]?.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {ORDER_STATUS_MAP[status]?.description}
                                </p>
                            )}
                        </div>

                        {/* Check Icon */}
                        {isActive && !isCurrent && (
                            <Check size={20} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                        )}
                        {isCurrent && (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full flex-shrink-0"
                            />
                        )}
                    </motion.div>
                );
            })}>
        </div>
    );
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 18 18" />
        </svg>
    )
}

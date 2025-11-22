"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, ChefHat, Truck, Package } from 'lucide-react';
import { OrderStatus, ORDER_STATUS_MAP } from '@/lib/delivery/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

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

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId]);

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
        <div className="w-full py-8">
            <div className="relative flex justify-between">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0" />

                {/* Active Progress Bar */}
                <motion.div
                    className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />

                {STEPS.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.status} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isCurrent ? 1.2 : 1,
                                    backgroundColor: isActive ? '#22c55e' : '#e5e7eb', // green-500 or gray-200
                                }}
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 transition-colors duration-300",
                                    isActive ? "text-white" : "text-gray-400 dark:text-gray-600 dark:bg-gray-800"
                                )}
                            >
                                <Icon size={16} />
                            </motion.div>
                            <span className={cn(
                                "absolute top-12 text-xs font-bold whitespace-nowrap transition-colors duration-300",
                                isActive ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-600"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Status Message */}
            <div className="mt-12 text-center">
                <motion.div
                    key={status}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-6 py-3 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                >
                    <p className="font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                        {ORDER_STATUS_MAP[status]?.icon} {ORDER_STATUS_MAP[status]?.description}
                    </p>
                </motion.div>
            </div>
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

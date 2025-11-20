"use client";

import { CartProvider } from '@/lib/delivery/CartContext';
import { BottomNav } from '@/components/delivery/BottomNav';

export default function DeliveryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CartProvider>
            <div className="pb-20 lg:pb-0">
                {children}
            </div>
            <BottomNav />
        </CartProvider>
    );
}

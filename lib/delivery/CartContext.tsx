"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DeliveryProduct } from './types';

interface CartItem extends DeliveryProduct {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: DeliveryProduct) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
    total: number;
    scheduledTime: string | null;
    setScheduledTime: (time: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [scheduledTime, setScheduledTime] = useState<string | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('delivery-cart');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
        const savedTime = localStorage.getItem('delivery-scheduled-time');
        if (savedTime) setScheduledTime(savedTime);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('delivery-cart', JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        if (scheduledTime) localStorage.setItem('delivery-scheduled-time', scheduledTime);
        else localStorage.removeItem('delivery-scheduled-time');
    }, [scheduledTime]);

    const addItem = (product: DeliveryProduct) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });

        // Dispatch event for immediate UI updates
        window.dispatchEvent(new Event('cart-updated'));
    };

    const removeItem = (productId: string) => {
        setItems((prev) => prev.filter((i) => i.id !== productId));
        window.dispatchEvent(new Event('cart-updated'));
    };

    const clearCart = () => {
        setItems([]);
        setScheduledTime(null);
    };

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, scheduledTime, setScheduledTime }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

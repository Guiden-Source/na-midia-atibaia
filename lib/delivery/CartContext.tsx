"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DeliveryProduct } from './types';
import { cartLogic } from './cart-logic';

interface CartItem extends DeliveryProduct {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: DeliveryProduct) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    scheduledTime: string | null;
    setScheduledTime: (time: string | null) => void;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [scheduledTime, setScheduledTime] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('delivery-cart', JSON.stringify(items));
        }
    }, [items, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            if (scheduledTime) localStorage.setItem('delivery-scheduled-time', scheduledTime);
            else localStorage.removeItem('delivery-scheduled-time');
        }
    }, [scheduledTime, isLoading]);

    const addItem = (product: DeliveryProduct) => {
        setItems((prev) => cartLogic.addItem(prev, product));
        window.dispatchEvent(new Event('cart-updated'));
    };

    const removeItem = (productId: string) => {
        setItems((prev) => cartLogic.removeItem(prev, productId));
        window.dispatchEvent(new Event('cart-updated'));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setItems((prev) => cartLogic.updateQuantity(prev, productId, quantity));
        window.dispatchEvent(new Event('cart-updated'));
    };

    const clearCart = () => {
        setItems([]);
        setScheduledTime(null);
        window.dispatchEvent(new Event('cart-updated'));
    };

    const total = cartLogic.calculateTotal(items);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, scheduledTime, setScheduledTime, isLoading }}>
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

import { DeliveryProduct } from './types';

export interface CartItem extends DeliveryProduct {
    quantity: number;
}

export const getEffectivePrice = (product: DeliveryProduct): number => {
    if (product.promotional_price && product.promotional_price > 0 && product.promotional_price < product.price) {
        return product.promotional_price;
    }
    return product.price;
};

export const cartLogic = {
    addItem: (items: CartItem[], product: DeliveryProduct): CartItem[] => {
        const existing = items.find((i) => i.id === product.id);
        if (existing) {
            return items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            );
        }
        return [...items, { ...product, quantity: 1 }];
    },

    removeItem: (items: CartItem[], productId: string): CartItem[] => {
        return items.filter((i) => i.id !== productId);
    },

    updateQuantity: (items: CartItem[], productId: string, quantity: number): CartItem[] => {
        if (quantity < 1) {
            return items.filter((i) => i.id !== productId);
        }
        return items.map((i) => (i.id === productId ? { ...i, quantity } : i));
    },

    calculateTotal: (items: CartItem[]): number => {
        return items.reduce((acc, item) => acc + getEffectivePrice(item) * item.quantity, 0);
    }
};

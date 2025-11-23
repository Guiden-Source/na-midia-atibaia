'use client';

import { useCart } from '@/lib/delivery/CartContext';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function CartBadge() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);
  const [localCount, setLocalCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    // Force update on event
    const handleUpdate = () => {
      const saved = localStorage.getItem('delivery-cart');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const count = parsed.reduce((acc: number, item: any) => acc + item.quantity, 0);
          setLocalCount(count);
        } catch (e) { }
      }
    };
    window.addEventListener('cart-updated', handleUpdate);
    handleUpdate(); // Initial load
    return () => window.removeEventListener('cart-updated', handleUpdate);
  }, []);

  // Calculate total item count from context or local state
  const contextCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const itemCount = mounted ? Math.max(contextCount, localCount) : 0;

  return (
    <Link
      href="/delivery/cart"
      className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      title="Ver carrinho"
    >
      <ShoppingCart size={24} className="text-gray-700 dark:text-gray-300" />

      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
}

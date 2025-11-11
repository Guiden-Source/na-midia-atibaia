'use client';

import { useEffect, useState } from 'react';
import { getCartItemCount } from '@/lib/delivery/cart';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export function CartBadge() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    // Carregar contagem inicial
    updateCount();

    // Listener para atualizar quando carrinho mudar
    const handleCartUpdate = () => updateCount();
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const updateCount = () => {
    setItemCount(getCartItemCount());
  };

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

'use client';

import { useEffect, useState } from 'react';
import { Cart as CartType } from '@/lib/delivery/types';
import { getCart, removeFromCart, updateCartItemQuantity, clearCart, formatPrice } from '@/lib/delivery/cart';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Cart() {
  const [cart, setCart] = useState<CartType>({ items: [], subtotal: 0, delivery_fee: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadCart();
    
    // Listener para atualizar carrinho
    const handleCartUpdate = () => loadCart();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const loadCart = () => {
    setCart(getCart());
    setIsLoading(false);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    loadCart();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateCartItemQuantity(productId, quantity);
    loadCart();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleClearCart = () => {
    if (confirm('Deseja realmente limpar o carrinho?')) {
      clearCart();
      loadCart();
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleCheckout = () => {
    router.push('/delivery/checkout');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Seu carrinho está vazio
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Adicione produtos para começar suas compras
        </p>
        <Link
          href="/delivery"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <ShoppingBag size={20} />
          <span>Ver Produtos</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Carrinho ({cart.items.length} {cart.items.length === 1 ? 'item' : 'itens'})
        </h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
        >
          Limpar carrinho
        </button>
      </div>

      {/* Lista de itens */}
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.product.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 flex items-center gap-4"
          >
            {/* Imagem */}
            {item.product.image_url ? (
              <div className="relative w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.product.image_url}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                📦
              </div>
            )}

            {/* Detalhes */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {item.product.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {formatPrice(item.product.price)} / {item.product.unit}
              </p>

              {/* Controles de quantidade */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus size={16} />
                </button>

                <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                  {item.quantity}
                </span>

                <button
                  onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                  disabled={item.quantity >= item.product.stock}
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Subtotal e remover */}
            <div className="flex flex-col items-end gap-3">
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {formatPrice(item.product.price * item.quantity)}
              </div>
              <button
                onClick={() => handleRemoveItem(item.product.id)}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                title="Remover item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo do pedido */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Resumo do Pedido
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatPrice(cart.subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
            <span>Taxa de entrega</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {cart.delivery_fee === 0 ? 'GRÁTIS' : formatPrice(cart.delivery_fee)}
            </span>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatPrice(cart.total)}
            </span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
        >
          Finalizar Pedido
        </button>

        <Link
          href="/delivery"
          className="block text-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mt-4 transition-colors"
        >
          ← Continuar comprando
        </Link>
      </div>
    </div>
  );
}

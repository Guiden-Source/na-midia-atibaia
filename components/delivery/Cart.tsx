'use client';

import { useEffect, useState } from 'react';
import { Cart as CartType } from '@/lib/delivery/types';
import { getCart, removeFromCart, updateCartItemQuantity, clearCart, formatPrice } from '@/lib/delivery/cart';
import { Trash2, Plus, Minus, ShoppingBag, Clock, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/delivery/CartContext';
import { SchedulingModal } from './SchedulingModal';

export function Cart() {
  const { items, total, removeItem, updateQuantity, clearCart, scheduledTime, isLoading } = useCart();
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const router = useRouter();
  // Calculate derived state
  const subtotal = total;
  const delivery_fee = 0; // Fixed for now, or calculate based on logic
  const finalTotal = subtotal + delivery_fee;

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleClearCart = () => {
    if (confirm('Deseja realmente limpar o carrinho?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    router.push('/delivery/checkout');
  };

  // Show loading state while context is initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-baloo2">
          Carrinho ({items.length} {items.length === 1 ? 'item' : 'itens'})
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
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            {/* Imagem */}
            {item.image_url ? (
              <div className="relative w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.image_url}
                  alt={item.name}
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
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 font-baloo2 text-lg">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {formatPrice(item.price)} / {item.unit}
              </p>

              {/* Controles de quantidade */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-300"
                >
                  <Minus size={16} />
                </button>

                <span className="w-8 text-center font-bold text-gray-900 dark:text-white">
                  {item.quantity}
                </span>

                <button
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-300"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Subtotal e remover */}
            <div className="flex flex-col items-end gap-3">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(item.price * item.quantity)}
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Remover item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumo do pedido */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-baloo2">
          Resumo do Pedido
        </h2>

        {/* Agendamento */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
              <Clock size={18} className="text-orange-500" />
              <span>Entrega:</span>
            </div>
            <button
              onClick={() => setIsSchedulingOpen(true)}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Alterar
            </button>
          </div>
          <div className="flex items-center gap-2">
            {scheduledTime ? (
              <>
                <Calendar size={16} className="text-gray-400" />
                <span className="font-bold text-gray-900 dark:text-white">
                  Hoje às {scheduledTime}
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-bold text-gray-900 dark:text-white">
                  O mais rápido possível (30-45 min)
                </span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatPrice(subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
            <span>Taxa de entrega</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {delivery_fee === 0 ? 'GRÁTIS' : formatPrice(delivery_fee)}
            </span>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900 dark:text-white font-baloo2">Total</span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400 font-baloo2">
              {formatPrice(finalTotal)}
            </span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full mt-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
        >
          Finalizar Pedido
        </button>

        <Link
          href="/delivery"
          className="block text-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium mt-4 transition-colors text-sm"
        >
          Continuar comprando
        </Link>
      </div>

      <SchedulingModal
        isOpen={isSchedulingOpen}
        onClose={() => setIsSchedulingOpen(false)}
      />
    </div>
  );
}

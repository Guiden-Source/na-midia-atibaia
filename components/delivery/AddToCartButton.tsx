'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DeliveryProduct } from '@/lib/delivery/types';
import { addToCart, getProductQuantityInCart } from '@/lib/delivery/cart';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface AddToCartButtonProps {
  product: DeliveryProduct;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({ product, disabled = false, className = '' }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const currentQuantity = getProductQuantityInCart(product.id);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoadingUser(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleAddToCart = async () => {
    // Verificar se usuário está logado
    if (!user) {
      const confirmLogin = confirm('Você precisa fazer login para adicionar produtos ao carrinho.\n\nDeseja fazer login agora?');
      if (confirmLogin) {
        router.push(`/login?redirect=/delivery/${product.id}`);
      }
      return;
    }

    if (disabled || product.stock < quantity) {
      alert('Estoque insuficiente');
      return;
    }

    setIsAdding(true);
    
    try {
      addToCart(product, quantity);
      
      // Emitir evento customizado para atualizar contador do carrinho
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Feedback visual
      alert(`✓ ${product.name} adicionado ao carrinho!`);
      
      // Reset quantity
      setQuantity(1);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert('Erro ao adicionar ao carrinho');
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (disabled) {
    return (
      <button
        disabled
        className={`${className} bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed`}
      >
        Indisponível
      </button>
    );
  }

  // Se não está logado, mostrar botão de login
  if (!user && !isLoadingUser) {
    return (
      <button
        onClick={handleAddToCart}
        className={`${className} w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors`}
      >
        <ShoppingCart size={18} />
        <span>Faça Login para Comprar</span>
      </button>
    );
  }

  // Loading user
  if (isLoadingUser) {
    return (
      <div className={`${className} w-full bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-lg flex items-center justify-center`}>
        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`${className} space-y-2`}>
      {/* Seletor de quantidade */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={decrementQuantity}
          disabled={quantity <= 1}
          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={16} />
        </button>
        
        <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
          {quantity}
        </span>
        
        <button
          onClick={incrementQuantity}
          disabled={quantity >= product.stock}
          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Botão adicionar */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding || disabled}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAdding ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Adicionando...</span>
          </>
        ) : (
          <>
            <ShoppingCart size={18} />
            <span>Adicionar ao carrinho</span>
          </>
        )}
      </button>

      {/* Já no carrinho */}
      {currentQuantity > 0 && (
        <div className="text-xs text-center text-green-600 dark:text-green-400">
          ✓ {currentQuantity} {currentQuantity === 1 ? 'unidade' : 'unidades'} no carrinho
        </div>
      )}
    </div>
  );
}

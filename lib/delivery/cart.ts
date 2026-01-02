// =====================================================
// DELIVERY SYSTEM - CARRINHO (LOCAL STORAGE)
// =====================================================

import type { DeliveryProduct, CartItem, Cart } from './types';

const CART_STORAGE_KEY = 'na-midia-delivery-cart';
const DELIVERY_FEE = 0; // Entrega grátis

/**
 * Obtém o carrinho do localStorage
 */
export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], subtotal: 0, delivery_fee: DELIVERY_FEE, total: 0 };
  }

  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) {
      return { items: [], subtotal: 0, delivery_fee: DELIVERY_FEE, total: 0 };
    }

    const items: CartItem[] = JSON.parse(cartData);
    return calculateCart(items);
  } catch (error) {
    console.error('Erro ao carregar carrinho:', error);
    return { items: [], subtotal: 0, delivery_fee: DELIVERY_FEE, total: 0 };
  }
}

/**
 * Salva o carrinho no localStorage
 */
export function saveCart(items: CartItem[]): Cart {
  if (typeof window === 'undefined') {
    return { items: [], subtotal: 0, delivery_fee: DELIVERY_FEE, total: 0 };
  }

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    return calculateCart(items);
  } catch (error) {
    console.error('Erro ao salvar carrinho:', error);
    return { items: [], subtotal: 0, delivery_fee: DELIVERY_FEE, total: 0 };
  }
}

/**
 * Adiciona item ao carrinho
 */
export function addToCart(product: DeliveryProduct, quantity: number = 1): Cart {
  const cart = getCart();
  const existingItem = cart.items.find((item) => item.product.id === product.id);

  let newItems: CartItem[];

  if (existingItem) {
    // Atualiza quantidade do item existente
    newItems = cart.items.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    // Adiciona novo item
    newItems = [...cart.items, { product, quantity }];
  }

  return saveCart(newItems);
}

/**
 * Remove item do carrinho
 */
export function removeFromCart(productId: string): Cart {
  const cart = getCart();
  const newItems = cart.items.filter((item) => item.product.id !== productId);
  return saveCart(newItems);
}

/**
 * Atualiza quantidade de um item
 */
export function updateCartItemQuantity(productId: string, quantity: number): Cart {
  const cart = getCart();

  if (quantity <= 0) {
    return removeFromCart(productId);
  }

  const newItems = cart.items.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );

  return saveCart(newItems);
}

/**
 * Limpa o carrinho
 */
export function clearCart(): Cart {
  return saveCart([]);
}

/**
 * Calcula totais do carrinho
 */
export function calculateCart(items: CartItem[]): Cart {
  const subtotal = items.reduce(
    (sum, item) => {
      const price = (item.product.promotional_price && item.product.promotional_price > 0 && item.product.promotional_price < item.product.price)
        ? item.product.promotional_price
        : item.product.price;
      return sum + price * item.quantity;
    },
    0
  );

  const delivery_fee = DELIVERY_FEE;
  const total = subtotal + delivery_fee;

  return {
    items,
    subtotal,
    delivery_fee,
    total,
  };
}

/**
 * Obtém quantidade total de itens no carrinho
 */
export function getCartItemCount(): number {
  const cart = getCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Verifica se um produto está no carrinho
 */
export function isProductInCart(productId: string): boolean {
  const cart = getCart();
  return cart.items.some((item) => item.product.id === productId);
}

/**
 * Obtém quantidade de um produto específico no carrinho
 */
export function getProductQuantityInCart(productId: string): number {
  const cart = getCart();
  const item = cart.items.find((item) => item.product.id === productId);
  return item?.quantity || 0;
}

/**
 * Valida se o carrinho está pronto para checkout
 */
export function validateCart(): {
  isValid: boolean;
  errors: string[];
} {
  const cart = getCart();
  const errors: string[] = [];

  if (cart.items.length === 0) {
    errors.push('Carrinho vazio');
  }

  // Validar estoque dos produtos
  cart.items.forEach((item) => {
    if (item.product.stock < item.quantity) {
      errors.push(`${item.product.name}: estoque insuficiente (disponível: ${item.product.stock})`);
    }

    if (!item.product.is_active) {
      errors.push(`${item.product.name}: produto indisponível`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Formata preço em reais
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Calcula desconto de um produto
 */
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

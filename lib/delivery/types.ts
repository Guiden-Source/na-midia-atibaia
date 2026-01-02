// =====================================================
// DELIVERY SYSTEM - TYPESCRIPT TYPES
// =====================================================

export type OrderStatus =
  | 'pending'      // Aguardando confirmação
  | 'confirmed'    // Pedido confirmado
  | 'preparing'    // Preparando pedido
  | 'delivering'   // Saiu para entrega
  | 'completed'    // Entregue
  | 'cancelled';   // Cancelado

export type PaymentMethod =
  | 'pix'
  | 'dinheiro'
  | 'cartao';

export type PaymentStatus =
  | 'pending'
  | 'paid';

// =====================================================
// CATEGORIA
// =====================================================
export interface DeliveryCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =====================================================
// PRODUTO
// =====================================================
export interface DeliveryProduct {
  id: string;
  category_id?: string;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  promotional_price?: number | null; // Preço promocional (se houver)
  original_price?: number; // Para calcular desconto
  discount_percentage?: number; // Percentual de desconto
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  unit: string; // 'un', 'kg', 'L', etc
  created_at: string;
  updated_at: string;

  // Relações (opcional)
  category?: DeliveryCategory;
}

// =====================================================
// PEDIDO
// =====================================================
export interface DeliveryOrder {
  id: string;
  order_number: string; // #001, #002, etc
  user_id?: string;
  user_name: string;
  user_phone: string;
  user_email?: string;

  // Endereço
  address_street: string;
  address_number: string;
  address_complement?: string;
  address_condominium: string; // Jeronimo de Camargo 1 ou 2
  address_block?: string;
  address_apartment?: string;
  address_reference?: string;

  // Pagamento
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  change_for?: number; // Troco para quanto?

  // Valores
  subtotal: number;
  delivery_fee: number;
  total: number;
  notes?: string;

  // Status
  status: OrderStatus;

  // Timestamps
  created_at: string;
  confirmed_at?: string;
  delivered_at?: string;
  cancelled_at?: string;

  // WhatsApp
  whatsapp_sent: boolean;
  whatsapp_sent_at?: string;

  // Relações (opcional)
  items?: DeliveryOrderItem[];
}

// =====================================================
// ITEM DO PEDIDO
// =====================================================
export interface DeliveryOrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  product_image?: string;
  price: number;
  quantity: number;
  subtotal: number;
  created_at: string;

  // Relações (opcional)
  product?: DeliveryProduct;
}

// =====================================================
// ITEM DO CARRINHO (estado local)
// =====================================================
export interface CartItem {
  product: DeliveryProduct;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
}

// =====================================================
// FORMULÁRIO DE CHECKOUT
// =====================================================
export interface CheckoutFormData {
  // Dados pessoais
  user_name: string;
  user_phone: string;
  user_email?: string;

  // Endereço
  address_street: string;
  address_number: string;
  address_complement?: string;
  address_condominium: string;
  address_block?: string;
  address_apartment?: string;
  address_reference?: string;

  // Pagamento
  payment_method: PaymentMethod;
  change_for?: number;

  // Observações
  notes?: string;
}

// =====================================================
// STATUS DO PEDIDO (para UI)
// =====================================================
export interface OrderStatusInfo {
  status: OrderStatus;
  label: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
}

export const ORDER_STATUS_MAP: Record<OrderStatus, OrderStatusInfo> = {
  pending: {
    status: 'pending',
    label: 'Aguardando',
    description: 'Pedido recebido, aguardando confirmação',
    icon: '⏳',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  confirmed: {
    status: 'confirmed',
    label: 'Confirmado',
    description: 'Pedido confirmado, em preparação',
    icon: '✅',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10',
  },
  preparing: {
    status: 'preparing',
    label: 'Preparando',
    description: 'Estamos preparando seu pedido',
    icon: '👨‍🍳',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  delivering: {
    status: 'delivering',
    label: 'Saiu para entrega',
    description: 'Pedido a caminho!',
    icon: '🚗',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  completed: {
    status: 'completed',
    label: 'Entregue',
    description: 'Pedido entregue com sucesso',
    icon: '🎉',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10',
  },
  cancelled: {
    status: 'cancelled',
    label: 'Cancelado',
    description: 'Pedido cancelado',
    icon: '❌',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10',
  },
};

// =====================================================
// CONDOMÍNIOS PERMITIDOS
// =====================================================
export const ALLOWED_CONDOMINIUMS = [
  'Jeronimo de Camargo 1',
  'Jeronimo de Camargo 2',
] as const;

export type AllowedCondominium = typeof ALLOWED_CONDOMINIUMS[number];

// =====================================================
// MÉTODOS DE PAGAMENTO (para UI)
// =====================================================
export interface PaymentMethodInfo {
  method: PaymentMethod;
  label: string;
  icon: string;
  requiresChange: boolean;
}

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    method: 'pix',
    label: 'PIX',
    icon: '📱',
    requiresChange: false,
  },
  {
    method: 'dinheiro',
    label: 'Dinheiro',
    icon: '💵',
    requiresChange: true,
  },
  {
    method: 'cartao',
    label: 'Cartão (na entrega)',
    icon: '💳',
    requiresChange: false,
  },
];

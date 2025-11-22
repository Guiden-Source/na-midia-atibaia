// =====================================================
// DELIVERY SYSTEM - SUPABASE QUERIES
// =====================================================

import { supabase } from '@/lib/supabase';
import type {
  DeliveryCategory,
  DeliveryProduct,
  DeliveryOrder,
  DeliveryOrderItem,
  CheckoutFormData,
  CartItem,
} from './types';

// =====================================================
// CATEGORIAS
// =====================================================

export async function getCategories() {
  const { data, error } = await supabase
    .from('delivery_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }

  return data as DeliveryCategory[];
}

// =====================================================
// PRODUTOS
// =====================================================

export async function getProducts(categorySlug?: string) {
  let query = supabase
    .from('delivery_products')
    .select(`
      *,
      category:delivery_categories(*)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (categorySlug) {
    query = query.eq('category.slug', categorySlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }

  return data as DeliveryProduct[];
}

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('delivery_products')
    .select(`
      *,
      category:delivery_categories(*)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
    throw error;
  }

  return data as DeliveryProduct[];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('delivery_products')
    .select(`
      *,
      category:delivery_categories(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar produto:', error);
    throw error;
  }

  return data as DeliveryProduct;
}

export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('delivery_products')
    .select(`
      *,
      category:delivery_categories(*)
    `)
    .eq('is_active', true)
    .ilike('name', `%${query}%`)
    .limit(20);

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }

  return data as DeliveryProduct[];
}

// =====================================================
// PEDIDOS
// =====================================================

export async function createOrder(
  checkoutData: CheckoutFormData,
  cartItems: CartItem[],
  subtotal: number,
  deliveryFee: number,
  total: number,
  userId?: string
): Promise<DeliveryOrder> {
  try {
    // 1. Gerar número do pedido
    const { data: orderNumberData, error: orderNumberError } = await supabase
      .rpc('generate_order_number');

    if (orderNumberError) throw orderNumberError;
    const orderNumber = orderNumberData as string;

    // 2. Gerar ID do pedido (client-side) para evitar retorno do INSERT (RLS)
    const orderId = crypto.randomUUID();

    // 3. Criar pedido
    const { error: orderError } = await supabase
      .from('delivery_orders')
      .insert({
        id: orderId,
        order_number: orderNumber,
        user_id: userId,
        user_name: checkoutData.user_name,
        user_phone: checkoutData.user_phone,
        user_email: checkoutData.user_email,
        address_street: checkoutData.address_street,
        address_number: checkoutData.address_number,
        address_complement: checkoutData.address_complement,
        address_condominium: checkoutData.address_condominium,
        address_block: checkoutData.address_block,
        address_apartment: checkoutData.address_apartment,
        address_reference: checkoutData.address_reference,
        payment_method: checkoutData.payment_method,
        change_for: checkoutData.change_for,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        notes: checkoutData.notes,
        status: 'pending',
      });

    if (orderError) throw orderError;

    // 4. Criar itens do pedido
    const orderItems = cartItems.map((item) => ({
      order_id: orderId,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image_url,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('delivery_order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Retornar objeto parcial (suficiente para redirecionamento)
    return {
      id: orderId,
      order_number: orderNumber,
      total,
      status: 'pending'
    } as DeliveryOrder;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
}

export async function getOrderById(orderId: string): Promise<DeliveryOrder | null> {
  // Tentar buscar via RPC (seguro para guest/anon)
  const { data: rpcData, error: rpcError } = await supabase
    .rpc('get_order_details_by_id', { p_order_id: orderId });

  if (!rpcError && rpcData) {
    return rpcData as DeliveryOrder;
  }

  // Fallback para método tradicional (caso RPC falhe ou não exista)
  const { data, error } = await supabase
    .from('delivery_orders')
    .select(`
      *,
      items:delivery_order_items(
        *,
        product:delivery_products(*)
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Erro ao buscar pedido:', error);
    return null;
  }

  return data as DeliveryOrder;
}

export async function getOrderByNumber(orderNumber: string): Promise<DeliveryOrder | null> {
  const { data, error } = await supabase
    .from('delivery_orders')
    .select(`
      *,
      items:delivery_order_items(
        *,
        product:delivery_products(*)
      )
    `)
    .eq('order_number', orderNumber)
    .single();

  if (error) {
    console.error('Erro ao buscar pedido:', error);
    return null;
  }

  return data as DeliveryOrder;
}

export async function getUserOrders(userPhone: string): Promise<DeliveryOrder[]> {
  const { data, error } = await supabase
    .from('delivery_orders')
    .select(`
      *,
      items:delivery_order_items(
        *,
        product:delivery_products(*)
      )
    `)
    .eq('user_phone', userPhone)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar pedidos do usuário:', error);
    throw error;
  }

  return data as DeliveryOrder[];
}

export async function markWhatsAppSent(orderId: string) {
  const { error } = await supabase
    .from('delivery_orders')
    .update({
      whatsapp_sent: true,
      whatsapp_sent_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) {
    console.error('Erro ao marcar WhatsApp enviado:', error);
    throw error;
  }
}

// =====================================================
// ADMIN: GERENCIAMENTO DE PEDIDOS
// =====================================================

export async function getAllOrders(status?: string): Promise<DeliveryOrder[]> {
  let query = supabase
    .from('delivery_orders')
    .select(`
      *,
      items:delivery_order_items(
        *,
        product:delivery_products(*)
      )
    `)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar pedidos:', error);
    throw error;
  }

  return data as DeliveryOrder[];
}

export async function updateOrderStatus(orderId: string, status: string) {
  const updates: any = { status };

  // Atualizar timestamps baseado no status
  if (status === 'confirmed') {
    updates.confirmed_at = new Date().toISOString();
  } else if (status === 'completed') {
    updates.delivered_at = new Date().toISOString();
  } else if (status === 'cancelled') {
    updates.cancelled_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('delivery_orders')
    .update(updates)
    .eq('id', orderId);

  if (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    throw error;
  }
}

export async function getOrderStats() {
  try {
    // Total de pedidos
    const { count: totalOrders } = await supabase
      .from('delivery_orders')
      .select('*', { count: 'exact', head: true });

    // Pedidos pendentes
    const { count: pendingOrders } = await supabase
      .from('delivery_orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Pedidos em andamento (confirmed, preparing, delivering)
    const { count: activeOrders } = await supabase
      .from('delivery_orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['confirmed', 'preparing', 'delivering']);

    // Pedidos completados hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayOrders } = await supabase
      .from('delivery_orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    // Faturamento total (pedidos completed)
    const { data: completedOrders } = await supabase
      .from('delivery_orders')
      .select('total')
      .eq('status', 'completed');

    const totalRevenue = completedOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

    return {
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      activeOrders: activeOrders || 0,
      todayOrders: todayOrders || 0,
      totalRevenue,
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
}

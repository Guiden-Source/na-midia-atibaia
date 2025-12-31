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
    // Preparar itens para o RPC
    const itemsJson = cartItems.map((item) => ({
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image_url,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
    }));

    // Chamar RPC atômico
    const { data, error } = await supabase.rpc('create_delivery_order_complete', {
      p_user_id: userId || null,
      p_user_name: checkoutData.user_name,
      p_user_phone: checkoutData.user_phone,
      p_user_email: checkoutData.user_email || null,
      p_address_street: checkoutData.address_street,
      p_address_number: checkoutData.address_number,
      p_address_complement: checkoutData.address_complement || null,
      p_address_condominium: checkoutData.address_condominium,
      p_address_block: checkoutData.address_block || null,
      p_address_apartment: checkoutData.address_apartment || null,
      p_address_reference: checkoutData.address_reference || null,
      p_payment_method: checkoutData.payment_method,
      p_change_for: checkoutData.change_for || null,
      p_subtotal: subtotal,
      p_delivery_fee: deliveryFee,
      p_total: total,
      p_notes: checkoutData.notes || null,
      p_items: itemsJson
    });

    if (error) throw error;

    return data as DeliveryOrder;
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
    // Retornar stats zerados em vez de throw
    return {
      totalOrders: 0,
      pendingOrders: 0,
      activeOrders: 0,
      todayOrders: 0,
      totalRevenue: 0,
    };
  }
}

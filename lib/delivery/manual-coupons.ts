import { createClient } from '@/lib/supabase/client';
import { generateCouponCode } from './simplified-checkout-types';

// Types
export interface ManualCouponData {
    code?: string; // Se vazio, gera automaticamente
    discountPercentage: number;
    userEmail?: string; // undefined = cupom global para todos
    expiresAt: Date;
    minOrderValue: number;
    maxUses: number;
    createdByAdminEmail: string;
}

export interface CouponListItem {
    id: string;
    code: string;
    discount_percentage: number;
    user_email: string | null;
    expires_at: string;
    is_active: boolean;
    manual_created: boolean;
    created_by_admin_email: string | null;
    min_order_value: number;
    max_uses: number;
    times_used: number;
    is_global: boolean;
    created_at: string;
}

/**
 * Cria um cupom manual
 */
export async function createManualCoupon(data: ManualCouponData): Promise<{ success: boolean; coupon?: CouponListItem; error?: string }> {
    const supabase = createClient();

    // Gerar código se não fornecido
    const code = data.code || generateCouponCode(data.discountPercentage, data.userEmail || 'GLOBAL');

    // Verificar se código já existe
    const { data: existing } = await supabase
        .from('delivery_coupons_progressive')
        .select('id')
        .eq('code', code)
        .single();

    if (existing) {
        return { success: false, error: 'Código de cupom já existe' };
    }

    // Inserir cupom
    const { data: coupon, error } = await supabase
        .from('delivery_coupons_progressive')
        .insert({
            code,
            discount_percentage: data.discountPercentage,
            user_email: data.userEmail || null,
            user_id: null, // Manual não tem user_id fixo
            expires_at: data.expiresAt.toISOString(),
            is_active: true,
            manual_created: true,
            created_by_admin_email: data.createdByAdminEmail,
            min_order_value: data.minOrderValue,
            max_uses: data.maxUses,
            times_used: 0,
            is_global: !data.userEmail, // Global se não tiver email específico
        })
        .select()
        .single();

    if (error) {
        console.error('Erro ao criar cupom:', error);
        return { success: false, error: error.message };
    }

    return { success: true, coupon };
}

/**
 * Atualiza status do cupom (ativar/desativar)
 */
export async function updateCouponStatus(couponId: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();

    const { error } = await supabase
        .from('delivery_coupons_progressive')
        .update({ is_active: isActive })
        .eq('id', couponId);

    if (error) {
        console.error('Erro ao atualizar status do cupom:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * Deleta um cupom
 */
export async function deleteCoupon(couponId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();

    const { error } = await supabase
        .from('delivery_coupons_progressive')
        .delete()
        .eq('id', couponId);

    if (error) {
        console.error('Erro ao deletar cupom:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * Lista cupons com filtros
 */
export async function listCoupons(filters?: {
    isActive?: boolean;
    manualCreated?: boolean;
    search?: string;
}): Promise<CouponListItem[]> {
    const supabase = createClient();

    let query = supabase
        .from('delivery_coupons_progressive')
        .select('*')
        .order('created_at', { ascending: false });

    if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
    }

    if (filters?.manualCreated !== undefined) {
        query = query.eq('manual_created', filters.manualCreated);
    }

    if (filters?.search) {
        query = query.or(`code.ilike.%${filters.search}%,user_email.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Erro ao listar cupons:', error);
        return [];
    }

    return data || [];
}

/**
 * Valida cupom (versão atualizada com verificações de is_active e max_uses)
 */
export async function validateManualCoupon(
    code: string,
    userEmail: string,
    orderTotal: number
): Promise<{ valid: boolean; coupon?: CouponListItem; error?: string }> {
    const supabase = createClient();

    const { data: coupon, error } = await supabase
        .from('delivery_coupons_progressive')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

    if (error || !coupon) {
        return { valid: false, error: 'Cupom não encontrado' };
    }

    // Verificar se está ativo
    if (!coupon.is_active) {
        return { valid: false, error: 'Cupom desativado' };
    }

    // Verificar expiração
    if (new Date(coupon.expires_at) < new Date()) {
        return { valid: false, error: 'Cupom expirado' };
    }

    // Verificar se é global ou para usuário específico
    if (!coupon.is_global && coupon.user_email !== userEmail) {
        return { valid: false, error: 'Cupom não disponível para você' };
    }

    // Verificar limite de usos
    if (coupon.times_used >= coupon.max_uses) {
        return { valid: false, error: 'Cupom já foi usado o número máximo de vezes' };
    }

    // Verificar valor mínimo do pedido
    if (orderTotal < coupon.min_order_value) {
        return {
            valid: false,
            error: `Valor mínimo do pedido: R$ ${coupon.min_order_value.toFixed(2)}`
        };
    }

    return { valid: true, coupon };
}

/**
 * Incrementa contador de usos do cupom
 */
export async function incrementCouponUsage(couponId: string): Promise<void> {
    const supabase = createClient();

    await supabase.rpc('increment_coupon_usage', {
        coupon_id: couponId
    });
}

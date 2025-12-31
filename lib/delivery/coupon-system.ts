import { createClient } from '@/lib/supabase/client';
import { generateCouponCode, COUPON_PROGRESSION, type CouponProgressiveData, type CouponValidationResult } from './simplified-checkout-types';

/**
 * Gera cupom progressivo após um pedido bem-sucedido
 * 1º pedido → 10% OFF próximo
 * 2º pedido → 15% OFF próximo
 * 3º+ pedidos → 20% OFF próximo
 */
export async function generateProgressiveCoupon(
    userEmail: string,
    userId: string | null,
    orderNumber: number,
    orderTotal: number
): Promise<CouponProgressiveData> {
    const supabase = createClient();

    // Determinar desconto baseado no número do pedido
    let discountPercentage: number;
    if (orderNumber === 1) {
        discountPercentage = COUPON_PROGRESSION.FIRST_ORDER; // 10%
    } else if (orderNumber === 2) {
        discountPercentage = COUPON_PROGRESSION.SECOND_ORDER; // 15%
    } else {
        discountPercentage = COUPON_PROGRESSION.THIRD_ORDER; // 20%
    }

    // Gerar código único
    const code = generateCouponCode(discountPercentage, userEmail);

    // Data de expiração (30 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Inserir cupom no banco
    const { data, error } = await supabase
        .from('delivery_coupons_progressive')
        .insert({
            code,
            discount_percentage: discountPercentage,
            max_uses: 1,
            used_count: 0,
            is_used: false,
            user_email: userEmail,
            user_id: userId,
            order_number: orderNumber + 1, // Para o PRÓXIMO pedido
            expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error('Erro ao gerar cupom:', error);
        throw new Error('Falha ao gerar cupom de desconto');
    }

    return data as CouponProgressiveData;
}

/**
 * Valida se um cupom é válido para uso
 */
export async function validateCoupon(
    couponCode: string,
    userEmail: string
): Promise<CouponValidationResult> {
    const supabase = createClient();

    // Buscar cupom
    const { data: coupon, error } = await supabase
        .from('delivery_coupons_progressive')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .single();

    if (error || !coupon) {
        return {
            valid: false,
            discount: 0,
            error: 'Cupom não encontrado',
        };
    }

    // Verificar se cupom pertence ao usuário
    if (coupon.user_email !== userEmail) {
        return {
            valid: false,
            discount: 0,
            error: 'Este cupom não pertence a você',
        };
    }

    // Verificar se já foi usado
    if (coupon.is_used || coupon.used_count >= coupon.max_uses) {
        return {
            valid: false,
            discount: 0,
            error: 'Cupom já foi utilizado',
        };
    }

    // Verificar validade
    const now = new Date();
    const expiresAt = new Date(coupon.expires_at);
    if (now > expiresAt) {
        return {
            valid: false,
            discount: 0,
            error: 'Cupom expirado',
        };
    }

    return {
        valid: true,
        discount: coupon.discount_percentage,
        couponData: coupon as CouponProgressiveData,
    };
}

/**
 * Aplica cupom ao pedido e calcula desconto
 */
export async function applyCouponToOrder(
    couponCode: string,
    userEmail: string,
    orderTotal: number
): Promise<{ newTotal: number; discountApplied: number; discountPercentage: number }> {
    // Validar cupom primeiro
    const validation = await validateCoupon(couponCode, userEmail);

    if (!validation.valid) {
        throw new Error(validation.error || 'Cupom inválido');
    }

    // Calcular desconto
    const discountPercentage = validation.discount;
    const discountAmount = (orderTotal * discountPercentage) / 100;
    const newTotal = orderTotal - discountAmount;

    return {
        newTotal,
        discountApplied: discountAmount,
        discountPercentage,
    };
}

/**
 * Marca cupom como usado após pedido confirmado
 */
export async function markCouponAsUsed(couponCode: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
        .from('delivery_coupons_progressive')
        .update({
            is_used: true,
            used_count: 1, // Incrementa contador
        })
        .eq('code', couponCode.toUpperCase());

    if (error) {
        console.error('Erro ao marcar cupom como usado:', error);
        throw new Error('Falha ao processar cupom');
    }
}

/**
 * Busca quantos pedidos o usuário já fez (para determinar progressão)
 */
export async function getUserOrderCount(userEmail: string): Promise<number> {
    const supabase = createClient();

    const { count, error } = await supabase
        .from('delivery_orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_email', userEmail);

    if (error) {
        console.error('Erro ao contar pedidos:', error);
        return 0;
    }

    return count || 0;
}

/**
 * Busca cupons válidos do usuário
 */
export async function getUserValidCoupons(userEmail: string, supabaseInstance?: any): Promise<CouponProgressiveData[]> {
    const supabase = supabaseInstance || createClient();

    const { data, error } = await supabase
        .from('delivery_coupons_progressive')
        .select('*')
        .eq('user_email', userEmail)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar cupons:', error);
        return [];
    }

    return (data as CouponProgressiveData[]) || [];
}

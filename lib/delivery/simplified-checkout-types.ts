// =====================================================
// DELIVERY SIMPLIFIED CHECKOUT - TYPESCRIPT TYPES
// =====================================================

/**
 * Condomínios permitidos para entrega
 */
export type Condominium = 'jeronimo1' | 'jeronimo2';

/**
 * Torres disponíveis nos condomínios
 */
export type Tower = 'A' | 'B' | 'C' | 'D';

/**
 * Formulário de checkout simplificado
 * Apenas localização + dados pessoais + cupom opcional
 */
export interface SimplifiedCheckoutFormData {
    // Localização
    condominium: Condominium;
    tower: Tower;
    apartment: string; // '101', '501', '1002'

    // Dados pessoais
    user_name: string;
    user_phone: string;
    user_email: string;

    // Cupom (opcional)
    coupon_code?: string;

    // Observações (opcional)
    notes?: string;
}

/**
 * Dados do cupom progressivo
 * Sistema de incentivo: 10% → 15% → 20%
 */
export interface CouponProgressiveData {
    id: string;
    code: string; // Ex: "VOLTA10-ABC123"
    discount_percentage: number; // 10, 15, 20
    max_uses: number; // Sempre 1 (cupom único por usuário)
    used_count: number;
    user_email: string;
    order_number: number; // 1º, 2º, 3º pedido do usuário
    is_used: boolean;
    expires_at: string;
    created_at: string;
}

/**
 * Resultado da validação de cupom
 */
export interface CouponValidationResult {
    valid: boolean;
    discount: number; // Valor percentual (10, 15, 20) se válido
    discountAmount?: number; // Valor em reais
    error?: string;
    couponData?: CouponProgressiveData;
}

/**
 * Informações do condomínio
 */
export interface CondominiumInfo {
    id: Condominium;
    name: string;
    displayName: string;
}

/**
 * Constantes de condomínios
 */
export const CONDOMINIUMS: CondominiumInfo[] = [
    {
        id: 'jeronimo1',
        name: 'Jeronimo de Camargo 1',
        displayName: 'Jeronimo 1',
    },
    {
        id: 'jeronimo2',
        name: 'Jeronimo de Camargo 2',
        displayName: 'Jeronimo 2',
    },
];

/**
 * Torres disponíveis
 */
export const TOWERS: Tower[] = ['A', 'B', 'C', 'D'];

/**
 * Progressão de cupons
 */
export const COUPON_PROGRESSION = {
    FIRST_ORDER: 10,  // 1º pedido → ganha 10% para próximo
    SECOND_ORDER: 15, // 2º pedido → ganha 15% para próximo
    THIRD_ORDER: 20,  // 3º+ pedidos → ganha 20% para próximo
} as const;

/**
 * Validação de telefone brasileiro
 */
export function validateBrazilianPhone(phone: string): boolean {
    // Remove caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    // Deve ter 10 ou 11 dígitos (com ou sem 9º dígito)
    return cleaned.length === 10 || cleaned.length === 11;
}

/**
 * Formata telefone brasileiro
 */
export function formatBrazilianPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }

    return phone;
}

/**
 * Gera código de cupom único
 */
export function generateCouponCode(discount: number, userEmail: string): string {
    const prefix = `VOLTA${discount}`;
    const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${uniqueId}`;
}

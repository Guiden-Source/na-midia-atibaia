/**
 * Featured Products & Search Queries
 * 
 * Queries para a FASE 1 do refactor de delivery:
 * - Busca com autocomplete
 * - Produtos em destaque
 * - Ordenação de produtos
 */

import { createClient } from '@/lib/supabase/client';

export type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'newest';

export type BadgeType = 'bestseller' | 'new' | 'discount';

export interface ProductWithBadge {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    emoji: string | null;
    active: boolean;
    stock: number;
    order_count: number;
    is_new: boolean;
    discount_percentage: number;
    badge?: {
        type: BadgeType;
        value?: number;
    };
}

/**
 * Busca produtos com autocomplete
 * Retorna máximo 5 produtos que correspondem ao termo
 */
export async function searchProducts(query: string): Promise<ProductWithBadge[]> {
    if (!query || query.trim().length < 2) return [];

    const supabase = createClient();
    const searchTerm = `%${query.trim()}%`;

    const { data, error } = await supabase
        .from('delivery_products')
        .select('*')
        .eq('active', true)
        .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .order('order_count', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error searching products:', error);
        return [];
    }

    return addBadgesToProducts(data || []);
}

/**
 * Busca produtos em destaque
 * Critérios: order_count >= 10, is_new = true, ou discount_percentage > 0
 */
export async function getFeaturedProducts(): Promise<ProductWithBadge[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('delivery_products')
        .select('*')
        .eq('active', true)
        .or('order_count.gte.10,is_new.eq.true,discount_percentage.gt.0')
        .order('order_count', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }

    return addBadgesToProducts(data || []);
}

/**
 * Busca produtos com ordenação
 */
export async function getProductsSorted(
    sortBy: SortOption = 'popular',
    categoryId?: string
): Promise<ProductWithBadge[]> {
    const supabase = createClient();

    const orderConfig = {
        popular: { column: 'order_count' as const, ascending: false },
        price_asc: { column: 'price' as const, ascending: true },
        price_desc: { column: 'price' as const, ascending: false },
        newest: { column: 'created_at' as const, ascending: false },
    };

    const { column, ascending } = orderConfig[sortBy];

    let query = supabase
        .from('delivery_products')
        .select('*')
        .eq('active', true);

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query.order(column, { ascending });

    if (error) {
        console.error('Error fetching sorted products:', error);
        return [];
    }

    return addBadgesToProducts(data || []);
}

/**
 * Adiciona badges aos produtos baseado em regras
 */
function addBadgesToProducts(products: any[]): ProductWithBadge[] {
    return products.map(product => {
        let badge: { type: BadgeType; value?: number } | undefined;

        // Prioridade: bestseller > new > discount
        if (product.order_count >= 20) {
            badge = { type: 'bestseller' };
        } else if (product.is_new) {
            badge = { type: 'new' };
        } else if (product.discount_percentage > 0) {
            badge = { type: 'discount', value: product.discount_percentage };
        }

        return {
            ...product,
            badge,
        };
    });
}

/**
 * Atualiza order_count de um produto (chamado após pedido)
 */
export async function incrementProductOrderCount(productId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase.rpc('increment_product_order_count', {
        product_id: productId
    });

    if (error) {
        console.error('Error incrementing order count:', error);
    }
}

import { createClient } from '@/lib/supabase/client';

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CategoryFormData {
    name: string;
    slug?: string;
    icon?: string;
    display_order?: number;
    is_active?: boolean;
}

/**
 * List all categories (admin)
 */
export async function listCategories(): Promise<{ success: boolean; categories?: Category[]; error?: string }> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('delivery_categories')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, categories: data as Category[] };
}

/**
 * Create category
 */
export async function createCategory(data: CategoryFormData): Promise<{ success: boolean; category?: Category; error?: string }> {
    const supabase = createClient();

    // Generate slug from name if not provided
    const slug = data.slug || generateSlug(data.name);

    // Check if slug already exists
    const { data: existing } = await supabase
        .from('delivery_categories')
        .select('id')
        .eq('slug', slug)
        .single();

    if (existing) {
        return { success: false, error: 'Slug já existe. Escolha outro nome.' };
    }

    const { data: category, error } = await supabase
        .from('delivery_categories')
        .insert({
            name: data.name,
            slug,
            icon: data.icon || null,
            display_order: data.display_order || 0,
            is_active: data.is_active !== undefined ? data.is_active : true,
        })
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, category: category as Category };
}

/**
 * Update category
 */
export async function updateCategory(id: string, data: Partial<CategoryFormData>): Promise<{ success: boolean; category?: Category; error?: string }> {
    const supabase = createClient();

    // If updating slug, check uniqueness
    if (data.slug) {
        const { data: existing } = await supabase
            .from('delivery_categories')
            .select('id')
            .eq('slug', data.slug)
            .neq('id', id)
            .single();

        if (existing) {
            return { success: false, error: 'Slug já existe. Escolha outro.' };
        }
    }

    const { data: category, error } = await supabase
        .from('delivery_categories')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, category: category as Category };
}

/**
 * Delete category
 */
export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();

    // Check if category has products
    const { data: products } = await supabase
        .from('delivery_products')
        .select('id')
        .eq('category_id', id)
        .limit(1);

    if (products && products.length > 0) {
        return { success: false, error: 'Categoria possui produtos. Não é possível deletar.' };
    }

    const { error } = await supabase
        .from('delivery_categories')
        .delete()
        .eq('id', id);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * Toggle category active status
 */
export async function toggleCategoryStatus(id: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient();

    const { error } = await supabase
        .from('delivery_categories')
        .update({ is_active: isActive })
        .eq('id', id);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * Helper: Generate slug from name
 */
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .trim()
        .replace(/\s+/g, '-'); // Replace spaces with hyphens
}
